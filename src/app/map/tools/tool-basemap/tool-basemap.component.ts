import { Component, OnInit } from '@angular/core';
import { Basemap } from 'src/app/shared/basemap';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from 'src/app/map/map-styling.service';


/**
 * Component for selecting a basemap
 */
@Component({
    selector: 'app-tool-basemap',
    templateUrl: './tool-basemap.component.html',
    styleUrls: ['./tool-basemap.component.scss']
})
export class ToolBasemapComponent implements OnInit {
    basemaps: Basemap[];
    activeBasemap: Basemap;
    showLoadBasemap: boolean;

    constructor(private headerService: HeaderService, private mapStylingService: MapStylingService) {}

    ngOnInit() {
        this.headerService.changeTitle('Basis<span class="accent">karte</span>');
        this.basemaps = this.mapStylingService.basemaps;
        this.activeBasemap = this.mapStylingService.activeBasemap;
        this.showLoadBasemap = false;
    }

    /**
     * Set selected basemap to active basemap
     * @param basemap Selected basemap
     */
    onBasemapSelected(basemap) {
        this.activeBasemap = basemap;
        this.mapStylingService.changeActiveBasemap(basemap, false);
    }

    /**
     * Show user interface for loading a stored styling as basemap
     */
    toggleShowLoadBasemap() {
        this.showLoadBasemap = !this.showLoadBasemap;
    }

    /**
     * Loading a stored styling as basemap
     * @param basemapId basemap ID
     */
    onLoadBasemapStart(basemapId: string) {
        let uuid = basemapId.toLowerCase();
        // Check entered URL
        if (basemapId.search(/\?id\=/) > -1) {
            // Editor URL
            uuid = basemapId.substring(basemapId.lastIndexOf('?id=') + 4);
        } else if (basemapId.search(/\//) > -1) {
            // Style or Aplication URL
            uuid = basemapId.substring(basemapId.lastIndexOf('/') + 1);
        }
        // Check UUID format
        if (uuid.search(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b$/) === 0) {
            // Load basemap
            const newBasemap: Basemap = this.mapStylingService.addBasemap(uuid, true, false);
            this.activeBasemap = newBasemap;
            this.showLoadBasemap = false;
        }
    }

    /**
     * Increase map lightness
     */
    onLightnessUp() {
        this.mapStylingService.changeHSL(0, 10);
    }

    /**
     * Decrease map lightness
     */
    onLightnessDown() {
        this.mapStylingService.changeHSL(0, -10);
    }

    /**
     * Increase map saturation
     */
    onSaturationUp() {
        this.mapStylingService.changeHSL(10, 0);
    }

    /**
     * Decrease map saturation
     */
    onSaturationDown() {
        this.mapStylingService.changeHSL(-10, 0);
    }
}
