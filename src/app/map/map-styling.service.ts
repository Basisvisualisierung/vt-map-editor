import { EventEmitter, Injectable } from '@angular/core';
import { Basemap } from '../shared/basemap';
import { MapView } from '../shared/mapview';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';
import * as convert from 'color-convert';
import { ActivatedRoute } from '@angular/router';


/**
 * Service to manage the map styling
 */
@Injectable({
    providedIn: 'root'
})
export class MapStylingService {
    basemaps: Basemap[];

    activeStylingChanged = new EventEmitter<string>();
    activeBasemapChanged = new EventEmitter<MapView>();
    activeStyling: any;
    activeBasemap: Basemap;

    // Save current map styling
    mapView: MapView;

    // Save the configuration of input elements for group visibility (slider)
    groupSettings: any;
    // Save the configuartion of input elements for GUI layer visibility
    guiLayerSettings: any;
    mapUuid: string;

    constructor(private http: HttpClient, private route: ActivatedRoute, private appConfigService: AppConfigService) {
        this.basemaps = this.appConfigService.settings.basemaps;
        this.activeBasemap = this.basemaps[0];

        // Load standard style if no query parameter exists
        this.mapUuid = route.snapshot.queryParamMap.get('id');
        if (this.mapUuid === null || this.mapUuid.length === 0) {
            this.setActiveStylingJson();
        }

        this.mapView = new MapView(
            this.appConfigService.settings.map.startZoom,
            this.appConfigService.settings.map.startCenter,
            0,
            0
        );

        this.groupSettings = {};
        this.guiLayerSettings = {};
    }

    /**
     * Use random colors for the styling
     * @param styling Styling
     */
    randomColors(styling: any) {
        for (const layer of styling.layers) {
            const h = Math.ceil(Math.random() * 239);
            const s = Math.random() * 100;
            const l = Math.random() * 100;

            let type = layer.type;
            if (type !== 'raster') {
                // special case 'symbol': set 'text-color' instead of 'symbol-color'
                type = (type === 'symbol') ? 'text' : type;
                if (layer.paint === undefined) {
                    layer.paint = {};
                }
                layer.paint[type + '-color'] = 'hsl(' + h + ',' + s + '%,' + l + '%)';
            }
        }
        return styling;
    }

    /**
     * Change saturation and/or lightness for the whole map
     * Convert color value to HSL or HSLA
     * @param changeValueS value to increase/decrease the saturation
     * @param changeValueL value to increase/decrease the lightness
     */
    changeHSL(changeValueS: number, changeValueL: number) {
        const styling = this.activeStyling;
        for (const layer of styling.layers) {
            if (layer.type !== 'raster') {
                const colorType = (layer.type === 'symbol') ? 'text-color' : layer.type + '-color';
                if (layer.paint === undefined) {
                    layer.paint = {};
                }
                if (layer.paint[colorType] === undefined) {
                    layer.paint[colorType] = 'hsl(0,0%,0%)';
                } else if (!Array.isArray(layer.paint[colorType])) {
                    // Convert color to HSL -> Special cases like "interpolate" (array) are not converted
                    const color = layer.paint[colorType];
                    let convertColor = [300, 0, 60];
                    if (color.search !== undefined) {
                        if (color.search(/^rgb/) === 0) {
                            // rgb(255, 255, 0) -> [255,255,0]
                            // rgba(255, 255, 0, 1) -> [255,255,0]
                            let colorArray = color.substring(color.search(/\(/) + 1, color.length - 1)
                                .replace(/ /g, '')
                                .split(',');

                            // Temporarily remove alpha value for convertion
                            let alpha = 1;
                            if (color.search(/^rgba/) === 0) {
                                alpha = colorArray.pop();
                            }
                            colorArray = [
                                parseInt(colorArray[0], 10),
                                parseInt(colorArray[1], 10),
                                parseInt(colorArray[2], 10)
                            ];
                            convertColor = convert.rgb.hsl(colorArray);
                            convertColor[1] += changeValueS;
                            convertColor[2] += changeValueL;

                            // tslint:disable-next-line:max-line-length
                            layer.paint[colorType] = 'hsla(' + convertColor[0] + ',' + convertColor[1] + '%,' + convertColor[2] + '%,' + alpha + ')';

                        } else if (color.search(/^#/) === 0) {
                            // #FF0 -> [255,255,0]
                            // #FFFF00 -> [255,255,0]
                            convertColor = convert.hex.hsl(color.substring(1));
                            convertColor[1] += changeValueS;
                            convertColor[2] += changeValueL;

                            layer.paint[colorType] = 'hsl(' + convertColor[0] + ',' + convertColor[1] + '%,' + convertColor[2] + '%)';
                        } else if (color.search(/^hsl/) === 0) {
                            // hsl(100, 50%, 60%) -> [100,50,60]
                            // hsla(100, 50%, 60%, 1) -> [100,50,60]
                            let colorArray = color.substring(color.search(/\(/) + 1, color.length - 1)
                                .replace(/ /g, '')
                                .split(',');

                            // Temporarily remove alpha value for convertion
                            let alpha = 1;
                            if (color.search(/^hsla/) === 0) {
                                alpha = colorArray.pop();
                            }
                            colorArray = [
                                parseInt(colorArray[0], 10),
                                parseInt(colorArray[1].substring(0, colorArray[1].length - 1), 10) + changeValueS,
                                parseInt(colorArray[2].substring(0, colorArray[2].length - 1), 10) + changeValueL
                            ];

                            layer.paint[colorType] = 'hsla(' + colorArray[0] + ',' + colorArray[1] + '%,' + colorArray[2] + '%,' + alpha + ')';
                        }
                    }
                }

            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * Change active Styling
     * @param styling New styling
     * @emits MapStylingService#activeStylingChanged
     */
    changeActiveStyling(styling: any) {
        this.activeStyling = styling;
        this.activeStylingChanged.emit(this.activeStyling);
    }

    /**
     * Change active basemap
     * @param basemap New basemap
     * @param changeMapView true: load view parameters (zoom, center, pitch, bearing) from style; false: keep current map view
     */
    changeActiveBasemap(basemap: Basemap, changeMapView: boolean) {
        this.activeBasemap = basemap;
        // Event activeBasemapChanged is called in setActiveStylingJson (because of asynchonous calls)
        this.setActiveStylingJson(true, changeMapView);
    }

    /**
     * Read styling JSON for activeBasemap
     * @param basemapChanged true: function was called by changing the basemap -> emit event activeBasemapChanged
     * @param changeMapView true: load view parameters (zoom, center, pitch, bearing) from style; false: keep current map view
     */
    setActiveStylingJson(basemapChanged?: boolean, changeMapView?: boolean) {
        if (basemapChanged === true && this.activeBasemap.randomColors === true) {
            this.changeActiveStyling(this.randomColors(this.activeStyling));
            this.activeBasemapChanged.emit(null);
        } else {
            this.http.get(this.activeBasemap.styling).subscribe((style) => {
                if (this.activeBasemap.metadataFile !== undefined && this.activeBasemap.metadataFile.length > 0) {
                    this.http.get('assets/config/' + this.activeBasemap.metadataFile).subscribe((metadata) => {
                        style = this.addMetadata(style, metadata);
                        this.initBasemap(style, basemapChanged, changeMapView);
                    });
                } else {
                    this.initBasemap(style, basemapChanged, changeMapView);
                }
            });
        }
    }

    /**
     * Initialize Basemap
     * @param style Style JSON
     * @param basemapChanged true: function was called by changing the basemap -> emit event activeBasemapChanged
     * @param changeMapView true: load view parameters (zoom, center, pitch, bearing) from style; false: keep current map view
     * @emits MapStylingService#activeStylingChanged
     */
    initBasemap(style: any, basemapChanged?: boolean, changeMapView?: boolean) {
        this.changeActiveStyling(style);
        if (basemapChanged === true) {
            // Reset group and GUI layer settings
            this.groupSettings = {};
            this.guiLayerSettings = {};

            const basemapView = (changeMapView) ? new MapView(
                style['zoom'],
                style['center'],
                style['pitch'],
                style['bearing']
            ) : null;

            this.activeBasemapChanged.emit(basemapView);
        }
    }

    /**
     * Add new basemap
     * @param basemapId: Styling ID
     * @param activateBasemap true: activate basemap
     * @param changeMapView true: load view parameters (zoom, center, pitch, bearing) from style; false: keep current map view
     * @returns New basemap
     */
    addBasemap(basemapId: string, activateBasemap: boolean, changeMapView: boolean) {
        const newBasemap = new Basemap(
            basemapId,
            'assets/images/thumbnails/basemap_load.png',
            this.appConfigService.settings.mapService.url + '/style/' + basemapId
        );
        this.basemaps.push(newBasemap);
        if (activateBasemap) {
            this.changeActiveBasemap(newBasemap, changeMapView);
        }
        return newBasemap;
    }

    /**
     * Save map view of the styling (only center, zoom, bearing, pitch)
     * @param attrName Attribute name
     * @param value Attribute value
     */
    changeMapView(attrName: string, value: any) {
        if (attrName === 'center' || attrName === 'zoom' || attrName === 'bearing' || attrName === 'pitch') {
            this.mapView[attrName] = value;
        }
    }

    /**
     * Toggle layer visibility
     * @param layerId Layer ID
     * @param visible true: show; false: hide
     */
    changeLayerVisibility(layerId: string, visible: boolean) {
        const styling = this.activeStyling;
        for (const layer of styling.layers) {
            if (layerId === layer.id) {
                if (layer.layout === undefined) {
                    layer.layout = {};
                }
                layer.layout.visibility = visible ? 'visible' : 'none';
                break;
            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * Change layer attribute
     * @param layerId Layer ID
     * @param attributePath Path to attribute (attribut-level1.attribut-levelN)
     * @param value Attribute value
     */
    changeLayerAttribute(layerId: string, attributePath: string, value: any) {
        const styling = this.activeStyling;
        const attributeList = attributePath.split('.');
        const len = attributeList.length;
        for (const layer of styling.layers) {
            if (layerId === layer.id) {
                let schema = layer;
                for (let i = 0; i < len - 1; i++) {
                    const elem = attributeList[i];
                    if (!schema[elem]) {
                        schema[elem] = {};
                    }
                    schema = schema[elem];
                }
                schema[attributeList[len - 1]] = value;
                break;
            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * Change the detail level of a group
     * Layers of the group are shown regarding their group level
     * @param groupName Group name
     * @param detailLevel Detail level (0 - 3)
     */
    changeGroupDetailLevel(groupName: string, detailLevel: number) {
        // Save slider configuration
        if (!this.groupSettings[groupName]) {
            this.groupSettings[groupName] = {};
        }
        this.groupSettings[groupName].detailLevel = detailLevel;

        const styling = this.activeStyling;
        for (const layer of styling.layers) {
            if (layer.metadata !== undefined && layer.metadata['map-editor:group'] === groupName) {
                if (layer.layout === undefined) {
                    layer.layout = {};
                }

                if (layer.metadata['map-editor:detail-level'] <= detailLevel) {
                    layer.layout.visibility = 'visible';
                } else if (layer.metadata['map-editor:detail-level'] > detailLevel) {
                    layer.layout.visibility = 'none';
                }
            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * Change visibility for GUI layers
     * @param guiLayerName GUI layers name
     * @param visible true: show; false: hide
     */
    changeGuiLayerVisibility(guiLayerName: string, visible: boolean) {
        // Save visibility of GUI layer
        if (!this.guiLayerSettings[guiLayerName]) {
            this.guiLayerSettings[guiLayerName] = {};
        }
        this.guiLayerSettings[guiLayerName].visible = visible;

        const styling = this.activeStyling;
        for (const layer of styling.layers) {
            if (layer.metadata !== undefined && layer.metadata['map-editor:layer'] === guiLayerName) {
                if (layer.layout === undefined) {
                    layer.layout = {};
                }

                layer.layout.visibility = visible ? 'visible' : 'none';
            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * Change color of all stying layers of the GUI layer
     * @param guiLayerName GUI layer name
     * @param elementName Layer element name
     * @param color New color
     */
    changeGuiLayerColor(guiLayerName: string, elementName: string, color: string) {
        const styling = this.activeStyling;
        let opacity: number;
        if (color.includes('rgba')) {
            opacity = parseFloat(color.replace(/^.*,(.+)\)/, '$1'));
            color = color.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?/)[0] + ', 1)';
        }
        for (const layer of styling.layers) {
            if (layer.metadata !== undefined
                && layer.metadata['map-editor:layer'] === guiLayerName
                && layer.metadata['map-editor:layer-element'] === elementName) {
                if (layer.paint === undefined) {
                    layer.paint = {};
                }
                const colorType = (layer.type === 'symbol') ? 'text' : layer.type;
                layer.paint[colorType + '-color'] = color;
                if (opacity !== undefined) {
                    layer.paint[colorType + '-opacity'] = opacity;
                }
            }
        }
        this.changeActiveStyling(styling);
    }

    /**
     * will return a supported color with opacity or a predefined HTML color name, like yellow
     * @param color (hex, rgb, rgba, hsl, hsla, predefined HTML color name)
     * @param opacity opacity (0-1)
     */
    changeColorToSupported(color: string, opacity: number = 1) {
        if (color.includes('rgba')) {
            return color;
        } else if (color.includes('rgb(')) {
            return `rgba(${color.slice(4, color.length - 1)}, ${opacity})`;
        } else if (color.includes('#') && color.length === 7) {
            const tempHex = color.replace('#', '');
            const r = parseInt(tempHex.substring(0, 2), 16);
            const g = parseInt(tempHex.substring(2, 4), 16);
            const b = parseInt(tempHex.substring(4, 6), 16);
            return `rgba(${r},${g},${b},${opacity})`;
        } else if (color.includes('#') && color.length < 7) {
            let tempHex = color.replace('#', '');
            tempHex = tempHex[0] + tempHex[0] + tempHex[1] + tempHex[1] + tempHex[2] + tempHex[2];
            const r = parseInt(tempHex.substring(0, 2), 16);
            const g = parseInt(tempHex.substring(2, 4), 16);
            const b = parseInt(tempHex.substring(4, 6), 16);
            return `rgba(${r},${g},${b},${opacity})`;
        } else if (color.includes('hsla')) {
            return color;
        } else if (color.includes('hsl(')) {
            return `hsla(${color.slice(4, color.length - 1)}, ${opacity})`;
        } else {
            return color;
        }
    }

    /**
     * Add metadata for guiLayers and groups from configuration file
     * @param styling Style JSON
     * @param metadata Metadata JSON
     * @returns style
     */
    addMetadata(styling: any, metadata: any) {
        const metaMap = new Map();
        for (const layerMetadata of metadata) {
            for (const id of layerMetadata.id) {
                metaMap.set(id, layerMetadata.metadata);
            }
        }

        for (const layer of styling.layers) {
            // Remove metadata from style
            if (layer.metadata !== undefined) {
                layer.metadata = {};
            }

            // Add Metadata from configuration file
            if (metaMap.has(layer.id)) {
                layer.metadata = metaMap.get(layer.id);
            }
        }
        return styling;
    }
}
