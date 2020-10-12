import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from 'src/app/map/map-styling.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MapboxGlComponent } from './mapbox-gl.component';
import {ToolBasemapComponent} from '../tools/tool-basemap/tool-basemap.component';
import {MapFunctionService} from '../map-function.service';
import {EventEmitter} from '@angular/core';
import {MapView} from '../../shared/mapview';
import {AppConfigService} from '../../app-config.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MapboxGlComponent', () => {
    let component: MapboxGlComponent;
    let fixture: ComponentFixture<MapboxGlComponent>;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            declarations: [
                ToolBasemapComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: AppConfigService, useValue: {
                    settings: {
                        titles: {
                            map: ''
                        },
                        map: {
                            maxZoom: 18,
                            startCenter: [9.361699, 52.104253],
                            startZoom: 13,
                            showZoomLevel: false,
                            showScaleBar: true
                        },
                        mapService: {
                            url: '/map-service'
                        }
                    },
                }},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub},
                {provide: HeaderService, useClass: HeaderServiceStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapboxGlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
class MapFunctionServiceStub {
    mapFunctionsChanged = new EventEmitter<string>();
    mapFunctions = {
        navigation: {
            show: true,
            enabled: true
        },
        info: {
            show: true,
            enabled: true
        },
        search: {
            show: true,
            enabled: true
        },
        routing: {
            show: false,
            enabled: false,
            configuration: {
                color: '#FF0000'
            }
        }
    };
}
class MapStylingServiceStub {
    activeStylingChanged = new EventEmitter<string>();
    activeBasemapChanged = new EventEmitter<MapView>();
}
class HeaderServiceStub {
    changeTitle(title: string) {}
}
