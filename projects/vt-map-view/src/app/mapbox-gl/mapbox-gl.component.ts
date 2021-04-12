import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import mapboxgl from 'maplibre-gl';

import MapboxGlPitchControl from 'src/app/map/mapbox-gl/mapbox-gl.pitch.control';
import MapboxGlSearchControl from 'src/app/map/mapbox-gl/mapbox-gl.search.control';
import { AppConfigService } from '../app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

    constructor(private http: HttpClient,
                private route: ActivatedRoute) { }

    ngOnInit() {
        // Set initial map parameter
        this.map = new mapboxgl.Map({
            container: 'map',
        });
        const mapId = this.route.snapshot.params['id'];
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        this.http.get(AppConfigService.settings.mapService.url + '/config/' + mapId, options).subscribe((response: any) => {
            this.addControls(response);
        });
        this.http.get(AppConfigService.settings.mapService.url + '/style/' + mapId, options).subscribe((response: any) => {
            // overwrite styling-response depending on url params
            if (/^(\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('zoom'))) {
                response.zoom = Number(this.route.snapshot.queryParamMap.get('zoom'));
            }
            if (/^(-?\d+\.?\d*)(,\s*-?\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('center'))) {
                response.center = this.route.snapshot.queryParamMap.get('center').split(',', 2).map(x => + x);
            }
            if (/^(\d+\.?\d*)$/.test(this.route.snapshot.queryParamMap.get('pitch'))) {
                response.pitch = Number(this.route.snapshot.queryParamMap.get('pitch'));
            }
            if (/^(-?(\d+\.?\d*))$/.test(this.route.snapshot.queryParamMap.get('bearing'))) {
                response.bearing = Number(this.route.snapshot.queryParamMap.get('bearing'));
            }
            // set active styling
            this.activeStyling = response;
            this.map.setStyle(this.activeStyling);
        });

    }

    /**
     * Adds controls to the map, depending on the configuration
     * @param config map configuration
     */
    addControls(config: any) {
        this.map.addControl(new mapboxgl.ScaleControl());

        if (config.navigation.show && config.navigation.enabled) {
            this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
            this.map.addControl(new MapboxGlPitchControl(), 'top-left');
            this.map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                }
            }), 'top-left');
        }

        // Custom search control
        if (config.search.show && config.search.enabled) {
            this.map.addControl(new MapboxGlSearchControl(AppConfigService.settings.mapService.url), 'top-right');
        }

        // Popup
        this.map.on('click', (event: any) => {
            if (config.info.enabled) {
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
    }
}
