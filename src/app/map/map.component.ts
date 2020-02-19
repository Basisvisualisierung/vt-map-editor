import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapTool } from './tools/map-tool';
import { Router } from '@angular/router';
import { HeaderService } from '../header/header.service';
import { AppConfigService } from '../app-config.service';

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

    constructor(private router: Router, private headerService: HeaderService) { }

    ngOnInit() {
        this.toolOverlayHeight = 300;
        this.toolOverlayMinHeight = 300;
        this.showToolOverlay = false;

        // Header title
        this.headerTitle = AppConfigService.settings.titles.map;
        this.headerService.changeTitle(this.headerTitle);
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
