import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from '../../map-styling.service';
import {MapFunctionService} from '../../map-function.service';
import {Router} from '@angular/router';

/**
 * Tool for map editing
 */
@Component({
    selector: 'app-tool-edit',
    templateUrl: './tool-edit.component.html',
    styleUrls: ['./tool-edit.component.scss']
})
export class ToolEditComponent implements OnInit {
    activeStyling: any;
    showGroupConfiguration: boolean;
    hasGuiLayers: boolean;
    showGuiLayerConfiguration: boolean;


    constructor(private headerService: HeaderService,
                private mapStylingService: MapStylingService,
                private mapFunctionService: MapFunctionService,
                private router: Router) { }

    ngOnInit() {
        this.headerService.changeTitle('Karte <span class="accent">anpassen</span>');
        // listen when active styling is loaded if deep link is used
        this.mapStylingService.activeStylingChanged.subscribe( () => {
            this.activeStyling = this.mapStylingService.activeStyling;
            this.parseMetadata();
        });
        this.activeStyling = this.mapStylingService.activeStyling;
        if (this.activeStyling) {
            this.parseMetadata();
        }
    }

    /**
     * Read metadata of groups and layers
     */
    parseMetadata() {
        this.hasGuiLayers = false;
        this.showGroupConfiguration = false;
        this.showGuiLayerConfiguration = false;

        // Read metadata of groups and GUI layers
        for (const layer of this.activeStyling.layers) {
            if (layer.metadata && layer.metadata['map-editor:layer']) {
                this.hasGuiLayers = true;
                this.mapFunctionService.setGuiLayerState(true);
            }
            if (layer.metadata && layer.metadata['map-editor:group'] && layer.metadata['map-editor:detail-level']) {
                this.showGroupConfiguration = true;
            }
            // Stop iterating when groups and GUI layers found
            if (this.hasGuiLayers === true && this.showGroupConfiguration === true) {
                break;
            }
        }
        // Show GUI layers when only GUI layers and no groups are defined
        this.showGuiLayerConfiguration = !this.showGroupConfiguration && this.hasGuiLayers;
    }
}
