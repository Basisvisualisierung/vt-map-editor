import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapStylingService } from 'src/app/map/map-styling.service';
import {MapFunctionService} from '../../../map-function.service';
import {Router} from '@angular/router';

/**
 * Component for layer group configurations
 */
@Component({
    selector: 'app-group-configuration',
    templateUrl: './group-configuration.component.html',
    styleUrls: ['./group-configuration.component.scss']
})
export class GroupConfigurationComponent implements OnInit {
    @Input() hasGuiLayers: boolean;
    @Output() toggleGroupConfiguration = new EventEmitter<boolean>();
    layerGroups: string[];
    groupSettings: any;

    constructor(private mapStylingService: MapStylingService,
                private mapFunctionService: MapFunctionService,
                private router: Router) { }

    ngOnInit() {
        this.layerGroups = [];
        for (const layer of this.mapStylingService.activeStyling.layers) {
            if (layer.metadata && layer.metadata['map-editor:group']
                && layer.metadata['map-editor:detail-level'] && this.layerGroups.indexOf(layer.metadata['map-editor:group']) === -1) {
                this.layerGroups.push(layer.metadata['map-editor:group']);
            }
        }
        this.groupSettings = this.mapStylingService.groupSettings;
        this.hasGuiLayers = this.mapFunctionService.getGuiLayerState();
    }

    /**
     * Detail slider of a layer group was changed
     * @param groupName Group name
     * @param event Event
     */
    onGroupLevelChanged(groupName: string, event: any) {
        this.mapStylingService.changeGroupDetailLevel(groupName, event.value);
    }

    /**
     * Change GUI from group configuration to layer configuration
     */
    showLayerConfiguration() {
        this.router.navigate(['/map', 'edit', 'gui-layer']);
    }
}
