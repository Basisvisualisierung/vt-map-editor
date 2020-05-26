import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HeaderService } from 'src/app/header/header.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapStylingService } from '../../map-styling.service';
import { MapFunctionService } from '../../map-function.service';
import { AppConfigService } from 'src/app/app-config.service';

/**
 * Component to save and share the map stylings and configuration
 */
@Component({
    selector: 'app-tool-share',
    templateUrl: './tool-share.component.html',
    styleUrls: ['./tool-share.component.scss']
})
export class ToolShareComponent implements OnInit {
    stylingUrl: string;
    appUrl: string;
    appIframe: string;
    editorUrl: string;

    constructor(private headerService: HeaderService,
                private mapStylingService: MapStylingService,
                private mapFunctionService: MapFunctionService,
                private http: HttpClient,
                private snackBar: MatSnackBar) { }

    ngOnInit() {
        this.headerService.changeTitle('Karte <span class="accent">veröffentlichen</span>');

        const options = {
            headers: new HttpHeaders ({
                'Content-Type': 'application/json'
            })
        };

        // Add map view parameters (zoom, center, ...)
        const activeStyling = this.mapStylingService.activeStyling;
        const mapView = this.mapStylingService.mapView;
        for (const key in mapView) {
            if (mapView.hasOwnProperty(key)) {
                activeStyling[key] = mapView[key];
            }
        }

        const data = {
            style: activeStyling,
            configuration: this.mapFunctionService.mapFunctions
        };

        this.http.post(AppConfigService.settings.mapService.url + '/map', data, options).subscribe((response: any) => {
            this.stylingUrl = AppConfigService.settings.mapService.url + '/style/' + response.id;
            this.appUrl = AppConfigService.settings.mapView.url + '/' + response.id;
            this.appIframe = '<iframe src="' + response.application_url + '" style="border:none;width:100%;height:500px">';
            const mapPageUrl = window.location.protocol + '//' + window.location.host +
                           window.location.pathname.substring(0, window.location.pathname.search('/map/') + 4);
            this.editorUrl = mapPageUrl + '?id=' + response.id;
        });
    }

    /**
     * Show success message
     */
    onCopySuccess() {
        this.snackBar.open('URL wurde in die Zwischenablage kopiert.', '', {
            duration: 2000
        });
    }
}
