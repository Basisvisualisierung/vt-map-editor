import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
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
import {ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {DOMHelper} from '../../../testing/DOMHelper';

describe('MapboxGlComponent', () => {
    let component: MapboxGlComponent;
    let fixture: ComponentFixture<MapboxGlComponent>;
    let mapFunctionService: MapFunctionServiceStub;
    let mapStylingService: MapStylingServiceStub;
    let dh: DOMHelper<MapboxGlComponent>;

    beforeEach(waitForAsync(() => {
        return TestBed.configureTestingModule({
            declarations: [
                ToolBasemapComponent
            ],
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: AppConfigService, useClass: AppConfigServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub},
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (item: string) => {
                                    switch (item) {
                                        case 'zoom':
                                            return 5;
                                        case 'pitch':
                                            return 15;
                                        case 'bearing':
                                            return 10;
                                        case 'center':
                                            return '20,50';
                                        case 'bbox':
                                            return '20.0,30.3,20.1,30.4';
                                    }
                                },
                            }
                        }
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapboxGlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        dh = new DOMHelper<MapboxGlComponent>(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get a pitch value from paramMap', () => {
        expect(component.map.getPitch()).toBe(15);
    });

    it('should get a bearing value from paramMap', () => {
        expect(component.map.getBearing()).toBe(10);
    });

    it('should get a zoom value from paramMap', () => {
        expect(component.map.getZoom()).toBe(5);
    });

    it('should get a center lng value from paramMap', () => {
        expect(component.map.getCenter().lng).toBe(20);
    });

    it('should get a center lng value from paramMap', () => {
        expect(component.map.getCenter().lat).toBe(50);
    });

    it('should have a scale bar', () => {
        expect(fixture.debugElement.query(By.css('.mapboxgl-ctrl-scale'))).toBeTruthy();
    });

    it('should not show zoom lvl', () => {
        expect(fixture.debugElement.query(By.css('.zoom-control'))).toBe(null);
    });

    it('should have a navigationStatus to log if the navigation has already been added to the map', () => {
        expect(component.navigationControlStatus).toBeTruthy();
    });

    it('should have a searchStatus to log if the search has already been added to the map', () => {
        expect(component.searchControlStatus).toBeTruthy();
    });

    it('should add navigation if toggleNavigationControls is called with true and navigationControlStatus is false', (done) => {
        component.navigationControlStatus = false;
        component.toggleNavigationControls(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.query(By.css('.mapboxgl-ctrl-compass'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('.mapboxgl-ctrl-zoom-out'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('.mapboxgl-ctrl-zoom-in'))).toBeTruthy();
            expect(fixture.debugElement.query(By.css('.pitch-control'))).toBeTruthy();
            done();
        });
    });

    it('should only have one navigation if toggleNavigationControls is called with true', (done) => {
        component.toggleNavigationControls(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-compass')).length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-out')).length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-in')).length).toBe(1);
            expect(fixture.debugElement.queryAll(By.css('.pitch-control')).length).toBe(1);
            done();
        });
    });

    it('should only have no navigation if toggleNavigationControls is called with false', (done) => {
        component.toggleNavigationControls(false);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-compass')).length).toBe(0);
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-out')).length).toBe(0);
            expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-in')).length).toBe(0);
            expect(fixture.debugElement.queryAll(By.css('.pitch-control')).length).toBe(0);
            done();
        });
    });

    it('should call changeMapView of the styling service 4 times when setMapView is called', () => {
        mapStylingService = TestBed.inject(MapStylingService) as MapStylingServiceStub;
        spyOn(mapStylingService, 'changeMapView');
        component.setMapView();
        fixture.detectChanges();
        expect(mapStylingService.changeMapView).toHaveBeenCalledTimes(4);
    });

    it('should have navigation only once if mapFunctionService.mapFunctionsChanged is called multiple times', () => {
        mapFunctionService = TestBed.inject(MapFunctionService) as MapFunctionServiceStub;
        mapFunctionService.mapFunctionsChanged.emit('navigation');
        mapFunctionService.mapFunctionsChanged.emit('navigation');
        fixture.detectChanges();
        expect(dh.getLength('.mapboxgl-ctrl-compass')).toBe(1);
        expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-out')).length).toBe(1);
        expect(fixture.debugElement.queryAll(By.css('.mapboxgl-ctrl-zoom-in')).length).toBe(1);
        expect(fixture.debugElement.queryAll(By.css('.pitch-control')).length).toBe(1);
    });


    it('should add Search if toggleSearchControl is called with true', (done) =>  {
        component.searchControlStatus = false;
        component.toggleSearchControl(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.debugElement.query(By.css('.search-control'))).toBeTruthy();
            done();
        });
    });

    it('should only have one search if toggleSearchControl is called with true', (done) => {
        component.toggleSearchControl(true);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(dh.getLength('.search-control')).toBe(1);
            done();
        });
    });

    it('should have no search if toggleSearchControl is called with false', () => {
        component.toggleSearchControl(false);
        fixture.detectChanges();
        expect(dh.getLength('.search-control')).toBe(0);
    });

    it('should not try to remove search if there is no search', () => {
        component.toggleSearchControl(false);
        component.toggleSearchControl(false);
        fixture.detectChanges();
        expect(dh.getLength('.search-control')).toBe(0);
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
        }
    };
}
class MapStylingServiceStub {
    activeStylingChanged = new EventEmitter<string>();
    activeBasemapChanged = new EventEmitter<MapView>();
    changeMapView(attrName: string, value: any){

    }
}
class HeaderServiceStub {
    changeTitle(title: string) {}
}

class AppConfigServiceStub {
    // tslint:disable-next-line:max-line-length
    settings: { mapService: { url: string }; titles: { map: string }; map: { maxZoom: number; startCenter: number[]; showScaleBar: boolean; showZoomLevel: boolean; startZoom: number } } = {
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
    };
    initConfig() { }
}
