import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import mapboxgl from 'mapbox-gl';

import { MapStylingService } from '../map-styling.service';
import MapboxGlPitchControl from './mapbox-gl.pitch.control';
import MapboxGlSearchControl from './mapbox-gl.search.control';
import MapboxGlShowZoomControl from './mapbox-gl.show-zoom.control';
import { AppConfigService } from 'src/app/app-config.service';
import { MapFunctionService } from '../map-function.service';
import { MapView } from 'src/app/shared/mapview';
import {ActivatedRoute} from '@angular/router';

/**
 * Mapbox GL JS map client
 */
@Component({
    selector: 'app-mapbox-gl',
    template: '<div id="map" class="map"></div>',
    styleUrls: ['./mapbox-gl.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapboxGlComponent implements OnInit {
    activeStyling: {};
    map: mapboxgl.Map;
    navigationControl: any;
    pitchControl: any;
    searchControl: any;
    zoomControl: any;
    geolocateControl: any;
    bbox: number[];

    constructor(private mapStylingService: MapStylingService,
                private mapFunctionService: MapFunctionService,
                private appConfigService: AppConfigService,
                private route: ActivatedRoute) {
        // Get active styling from MapStylingService and use it as map content
        this.mapStylingService.activeStylingChanged.subscribe(
            (styling) => {
                this.activeStyling = styling;
                this.map.setStyle(this.activeStyling);
            }
        );
        // Get active styling from MapStylingService and use it as map content
        this.mapStylingService.activeBasemapChanged.subscribe(
            (mapView: MapView) => {
                if (mapView !== null) {
                    this.map.setZoom(mapView.zoom);
                    this.map.setCenter(mapView.center);
                    this.map.setPitch(mapView.pitch);
                    this.map.setBearing(mapView.bearing);
                }
            }
        );

        // Apply changes from MapFunctions to the map
        this.mapFunctionService.mapFunctionsChanged.subscribe(
            (functionName: string) => {
                if (functionName === 'navigation') {
                    this.toggleNavigationControls(this.mapFunctionService.mapFunctions.navigation.enabled);
                } else if (functionName === 'search') {
                    this.toggleSearchControl(this.mapFunctionService.mapFunctions.search.enabled);
                }
            }
        );
    }

    ngOnInit() {
        this.activeStyling = this.mapStylingService.activeStyling;
        // Set initial map parameter
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.activeStyling,
            maxZoom: this.appConfigService.settings.map.maxZoom,
            center: this.appConfigService.settings.map.startCenter,
            zoom: this.appConfigService.settings.map.startZoom,
            pitch: 0,
            bearing: 0,
        });
        // overwrite styling depending on url params
        if (/^(\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('zoom'))){
            this.map.setZoom(Number(this.route.snapshot.queryParamMap.get('zoom')));
        }
        if (/^(\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('pitch'))){
            this.map.setPitch(Number(this.route.snapshot.queryParamMap.get('pitch')));
        }
        if (/^(-?\d+\.?\d*)(,\s*-?\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('center'))){
            this.map.setCenter(this.route.snapshot.queryParamMap.get('center').split(',', 2 ).map(x => + x));
        }
        if (/^(-?(\d+\.?\d*))$/.test(this.route.snapshot.queryParamMap.get('bearing'))){
            this.map.setBearing( Number(this.route.snapshot.queryParamMap.get('bearing')));
        }
        // Add bounding box if bbox exists as url parameter
        if (/^(-?\d+\.?\d*)(,\s*-?\d+\.?\d*){3}$/.test(this.route.snapshot.queryParamMap.get('bbox'))) {
            this.bbox = this.route.snapshot.queryParamMap.get('bbox').split(',', 4 ).map(x => + x);
            this.map.fitBounds([
                [this.bbox[0], this.bbox[1]],
                [this.bbox[2], this.bbox[3]]]);
        }

        // Scale bar control
        if (this.appConfigService.settings.map.showScaleBar) {
            this.map.addControl(new mapboxgl.ScaleControl());
        }

        // Navigation controls
        const mapFunctions = this.mapFunctionService.mapFunctions;
        if (mapFunctions.navigation.show && mapFunctions.navigation.enabled) {
            this.toggleNavigationControls(true);
        }

        // Custom search control
        if (mapFunctions.search.show && mapFunctions.search.enabled) {
            this.toggleSearchControl(true);
        }

        // Custom zoom control
        if (this.appConfigService.settings.map.showZoomLevel === true) {
            this.zoomControl = new MapboxGlShowZoomControl();
            this.map.addControl(this.zoomControl, 'bottom-right');
        }

        // Popup
        this.map.on('click', (event: any) => {
            if (mapFunctions.info.enabled) {
                const features = this.map.queryRenderedFeatures(event.point);
                if (features.length) {
                    let content = '';

                    for (const feature of features) {
                        content += '<table class="info-table"><tr><th colspan="2">' +
                                    feature.layer.id + '</th></tr>';
                        for (const key in feature.properties) {
                            if (feature.properties.hasOwnProperty(key)) {
                                content += '<tr><td>' + key + ':</td><td>' + feature.properties[key] + '</td></tr>';
                            }
                        }
                        content += '</table>';
                    }

                    new mapboxgl.Popup({
                        className: 'info-popup',
                        maxWidth: '400px'
                    })
                    .setLngLat(event.lngLat)
                    .setHTML(content)
                    .addTo(this.map);
                }
            }
        });

        // Save changes of the map view in MapStylingService
        this.map.on('moveend', (event: any) => {
            this.setMapView();
            if (this.appConfigService.settings.map.showZoomLevel === true) {
                this.zoomControl.changeText(Math.round(this.map.getZoom() * 100) / 100);
            }
        });
    }

    /**
     * Save changes of the map view in MapStylingService
     */
    setMapView() {
        this.mapStylingService.changeMapView('center', [this.map.getCenter().lng, this.map.getCenter().lat]);
        this.mapStylingService.changeMapView('zoom', this.map.getZoom());
        this.mapStylingService.changeMapView('pitch', this.map.getPitch());
        this.mapStylingService.changeMapView('bearing', this.map.getBearing());
    }

    /**
     * Toggle navigation controls
     * @param enable true: show; false: hide
     */
    toggleNavigationControls(enable: boolean) {
        if (enable) {
            this.navigationControl = new mapboxgl.NavigationControl();
            this.pitchControl = new MapboxGlPitchControl();
            this.geolocateControl = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            });
            this.map.addControl(this.navigationControl, 'top-left');
            this.map.addControl(this.pitchControl, 'top-left');
            this.map.addControl(this.geolocateControl, 'top-left');
        } else {
            this.map.removeControl(this.navigationControl);
            this.map.removeControl(this.pitchControl);
            this.map.removeControl(this.geolocateControl);
        }
    }

    /**
     * Toggle search controls
     * @param enable true: show; false: hide
     */
    toggleSearchControl(enable: boolean) {
        if (enable) {
            this.searchControl = new MapboxGlSearchControl(this.appConfigService.settings.mapService.url);
            this.map.addControl(this.searchControl, 'top-right');
        } else {
            this.map.removeControl(this.searchControl);
        }
    }
}
