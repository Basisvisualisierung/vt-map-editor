import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { MapFunctionService } from '../../map-function.service';
import { MapFunctions } from 'src/app/shared/map-functions';

/**
 * Component for map functions
 */
@Component({
    selector: 'app-tool-functions',
    templateUrl: './tool-functions.component.html',
    styleUrls: ['./tool-functions.component.scss']
})
export class ToolFunctionsComponent implements OnInit {
    mapFunctions: MapFunctions;

    constructor(private headerService: HeaderService,
                private mapFunctionService: MapFunctionService) { }

    ngOnInit() {
        this.headerService.changeTitle('Funktionen <span class="accent">anpassen</span>');
        this.mapFunctions = this.mapFunctionService.mapFunctions;
    }

    /**
     * Toggle map function
     * @param functionName Name of map function
     * @param event Event
     */
    onFunctionToggle(functionName: string, event: any) {
        this.mapFunctions[functionName].enable = event.checked;
        this.mapFunctionService.toggleMapFunction(functionName, event.checked);
    }

    /**
     * CHange color of navigation route
     * @param color Color (hex, rgb, rgba, hsl, hsla)
     */
    onRouteColorChanged(color: string) {
        this.mapFunctions.routing.configuration.color = color;
        this.mapFunctionService.setFunctionConfiguration('routing', this.mapFunctions.routing.configuration);
    }
}
