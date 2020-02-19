import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MapStylingService } from 'src/app/map/map-styling.service';
import { AppConfigService } from 'src/app/app-config.service';

/**
 * Component to configure GUI layers
 */
@Component({
    selector: 'app-gui-layer-configuration',
    templateUrl: './gui-layer-configuration.component.html',
    styleUrls: ['./gui-layer-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GuiLayerConfigurationComponent implements OnInit {
    groups: Array<{
        name: string,
        guiLayers: Array<{
            name: string,
            visible: boolean,
            elements: Array<{
                name: string,
                layer: any
            }>
        }>
    }>;
    // Sortet list of GUI layers
    keyNames: Array<string>;

    constructor(private mapStylingService: MapStylingService) { }

    ngOnInit() {
        this.parseMetadata();
    }

    /**
     * Read metadata for groups and gui layers from styling
     */
    parseMetadata() {
        this.groups = [];
        // Stores combinations of names of the groups, GUI layers and layer elements that are already added to groups array
        this.keyNames = [];

        for (const layer of this.mapStylingService.activeStyling.layers) {
            if (layer.metadata) {
                let groupIdx = -1;
                let layerIdx = -1;

                // Add new group
                if (layer.metadata['map-editor:group'] && this.keyNames.indexOf(layer.metadata['map-editor:group']) === -1) {
                    this.keyNames.push(layer.metadata['map-editor:group']);
                    groupIdx = this.groups.push({
                        name: layer.metadata['map-editor:group'],
                        guiLayers: []
                    });
                    groupIdx--;
                }

                // Add new layer
                if (layer.metadata['map-editor:layer']
                    && this.keyNames.indexOf(layer.metadata['map-editor:group'] + layer.metadata['map-editor:layer']) === -1) {

                    this.keyNames.push(layer.metadata['map-editor:group'] + layer.metadata['map-editor:layer']);
                    let guiLayerVisible = true;
                    const guiLayerSettings = this.mapStylingService.guiLayerSettings[layer.metadata['map-editor:layer']];
                    if (guiLayerSettings !== undefined) {
                        guiLayerVisible = guiLayerSettings.visible;
                    }

                    if (groupIdx === -1) {
                        groupIdx = this.groups.findIndex(group => group.name === layer.metadata['map-editor:group']);
                    }
                    layerIdx = this.groups[groupIdx].guiLayers.push({
                        name: layer.metadata['map-editor:layer'],
                        visible: guiLayerVisible,
                        elements: []
                    });

                    layerIdx--;
                }

                // Add new layer element
                if (layer.metadata['map-editor:layer-element']
                    && this.keyNames.indexOf(layer.metadata['map-editor:group'] + layer.metadata['map-editor:layer'] + layer.metadata['map-editor:layer-element']) === -1) {

                    this.keyNames.push(layer.metadata['map-editor:group'] + layer.metadata['map-editor:layer'] + layer.metadata['map-editor:layer-element']);

                    if (groupIdx === -1) {
                        groupIdx = this.groups.findIndex(group => group.name === layer.metadata['map-editor:group']);
                    }
                    if (layerIdx === -1) {
                        layerIdx = this.groups[groupIdx].guiLayers.findIndex(guiLayer => guiLayer.name === layer.metadata['map-editor:layer']);
                    }

                    // Add layer element with selection of layer properties
                    this.groups[groupIdx].guiLayers[layerIdx].elements.push(
                        {
                            name: layer.metadata['map-editor:layer-element'],
                            layer: {
                                type: layer['type'],
                                paint: layer['paint']
                            }
                        }
                    );
                }
            }
        }

        // Sort arrays
        this.sortGroupsAndLayers();
    }

    /**
     * Change GUI layer visibility
     * @param layerName GUI-Layer Name
     * @param event Event
     */
    onVisibilityChanged(guiLayerName: string, event: any) {
        this.mapStylingService.changeGuiLayerVisibility(guiLayerName, event.checked);
    }

    /**
     * Sort arrays of groups and GUI layers by their names
     */
    sortGroupsAndLayers() {
        this.groups.sort(this.compareNames);

        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].guiLayers.sort(this.compareNames);
        }
    }

    /**
     * Compare two object by their attribute "name"
     * @param obj1 Object 1
     * @param obj2 Object 2
     */
    compareNames(obj1, obj2) {
        const objName1 = obj1.name.toLowerCase();
        const objName2 = obj2.name.toLowerCase();

        let compare = 0;
        if (objName1 > objName2) {
            compare = 1;
        } else if (objName1 < objName2) {
            compare = -1;
        }

        return compare;
    }
}
