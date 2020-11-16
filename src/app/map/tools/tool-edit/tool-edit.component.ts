import { Component, OnInit} from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from '../../map-styling.service';
import {MapFunctionService} from '../../map-function.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
/**
 * Tool for map editing
 */
@Component({
    selector: 'app-tool-edit',
    templateUrl: './tool-edit.component.html',
    styleUrls: ['./tool-edit.component.scss']
})
export class ToolEditComponent implements OnInit{
    activeStyling: any;
    previous: string [] = [];
    deepLink: boolean;

    constructor(private router: Router,
                private headerService: HeaderService,
                private mapStylingService: MapStylingService,
                private mapFunctionService: MapFunctionService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.headerService.changeTitle('Karte <span class="accent">anpassen</span>');
        // listen when active styling is loaded if deep link is used
        this.mapStylingService.activeStylingChanged.subscribe( () => {
            this.activeStyling = this.mapStylingService.activeStyling;
        });
        this.activeStyling = this.mapStylingService.activeStyling;
        // Check for deep link
        if (this.route.children.length !== 0) {
            this. deepLink = true;
        }
        // Show GUI layers when only GUI layers and no groups are defined
        if (!this.mapFunctionService.getGroupLayerState() && this.mapFunctionService.getGuiLayerState() && !this.deepLink) {
            this.router.navigate(['/map', 'edit', 'gui-layer'], { replaceUrl: true });
        }
        // Show layer when no GUI layers and no groups are defined
        else if (!this.mapFunctionService.getGroupLayerState() && !this.mapFunctionService.getGuiLayerState() && !this.deepLink) {
            this.router.navigate(['/map', 'edit', 'layer'], { replaceUrl: true });
        } else if (!this.deepLink){
            this.router.navigate(['/map', 'edit', 'group-layer'], { replaceUrl: true });
        }
    }
}
