import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapTool } from './tools/map-tool';
import {Router, ActivatedRoute, NavigationStart} from '@angular/router';
import { HeaderService } from '../header/header.service';
import { AppConfigService } from '../app-config.service';
import { MapStylingService } from './map-styling.service';
import {MapFunctionService} from './map-function.service';

/**
 * Map component containing map client, toolbar and tool overlay
 */
@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    tools: MapTool[] = [
        new MapTool(
            'map',
            'basemap'
        ),
        new MapTool(
            'layers',
            'edit'
        ),
        new MapTool(
            'settings',
            'functions'
        ),
        new MapTool(
            'share',
            'share'
        )
    ];

    showToolOverlay: boolean;
    toolOverlayHeight: number;
    toolOverlayMinHeight: number;
    headerTitle: string;
    activeChild: number;
    hasGuiLayers: boolean;
    showGroupConfiguration: boolean;
    showGuiLayerConfiguration: boolean;
    activeStyling: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private headerService: HeaderService,
                private mapStylingService: MapStylingService,
                private appConfigService: AppConfigService,
                private mapFunctionService: MapFunctionService) {

        // Load map by uuid from query parameters
        const mapUuid = route.snapshot.queryParamMap.get('id');
        if (mapUuid !== null && mapUuid.length > 0) {
            mapStylingService.addBasemap(mapUuid, true, true);
        }
    }

    ngOnInit() {
        this.toolOverlayHeight = 300;
        this.toolOverlayMinHeight = 300;
        this.showToolOverlay = false;

        // Header title
        this.headerTitle = this.appConfigService.settings.titles.map;
        this.headerService.changeTitle(this.headerTitle);
        if (this.route.children.length !== 0) {
           this.showToolOverlay = true;
        }
        this.router.events
            .subscribe((event: NavigationStart) => {
                if (this.route.children.length !== 0) {
                    this.showToolOverlay = true;
                }
            });
        this.mapStylingService.activeStylingChanged
            .subscribe(() => {
                this.activeStyling = this.mapStylingService.activeStyling;
                this.parseMetadata();
            });
    }

    /**
     * Read metadata of groups and layers
     */
    parseMetadata() {
        this.hasGuiLayers = false;
        this.showGroupConfiguration = false;
        this.showGuiLayerConfiguration = false;
        this.mapFunctionService.setGuiLayerState(false);
        this.mapFunctionService.setGroupLayerState(false);
        // Read metadata of groups and GUI layers
        for (const layer of this.activeStyling.layers) {
            if (layer.metadata && layer.metadata['map-editor:layer']) {
                this.hasGuiLayers = true;
                this.mapFunctionService.setGuiLayerState(true);
            }
            if (layer.metadata && layer.metadata['map-editor:group'] && layer.metadata['map-editor:detail-level']) {
                this.showGroupConfiguration = true;
                this.mapFunctionService.setGroupLayerState(true);
            }
            // Stop iterating when groups and GUI layers found
            if (this.hasGuiLayers === true && this.showGroupConfiguration === true) {
                break;
            }
        }
    }

    /**
     * Toolbar button clicked
     * @param tool Activated MapTool
     */
    onToolbarButtonClick(tool: MapTool) {
        this.router.navigate(['/map', tool.link]);
        this.showToolOverlay = true;
    }

    /**
     * Change height of tool overlay
     * @param height New height for tool overlay
     */
    onResizeToolOverlay(height: number) {
        this.toolOverlayHeight = height;
    }

    /**
     * Close tool overlay
     */
    onCloseToolOverlay() {
        this.showToolOverlay = false;
        this.headerService.changeTitle(this.headerTitle);
        this.router.navigate(['/map']);
    }
}
