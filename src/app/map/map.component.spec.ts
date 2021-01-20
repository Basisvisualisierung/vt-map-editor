import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { MapComponent } from './map.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderService} from '../header/header.service';
import {MapStylingService} from './map-styling.service';
import {Component, EventEmitter} from '@angular/core';
import {AppConfigService} from '../app-config.service';
import {MapFunctionService} from './map-function.service';
import {MapView} from '../shared/mapview';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MapboxGlComponent} from './mapbox-gl/mapbox-gl.component';
import {SettingsModel} from '../shared/settings.model';
import {Location} from '@angular/common';
import {By} from '@angular/platform-browser';
import {ToolOverlayComponent} from './tools/tool-overlay/tool-overlay.component';
import {ResizableModule} from 'angular-resizable-element';
import {Router} from '@angular/router';
import {DOMHelper} from '../../testing/DOMHelper';
import {MapTool} from './tools/map-tool';
import {ToolShareComponent} from './tools/tool-share/tool-share.component';


describe('MapComponent', () => {
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;
    let dh: DOMHelper<MapComponent>;
    let location: Location;
    let router: Router;
    let mapStylingServiceMock: any;
    let mapView: MapView;
    let headerServiceMock: any;

    beforeEach(async(() => {
        mapStylingServiceMock = jasmine.createSpyObj('MapStylingService', ['addBasemap', 'changeMapView']);
        mapStylingServiceMock.activeStylingChanged = new EventEmitter<string>();
        mapStylingServiceMock.activeBasemapChanged = new EventEmitter<MapView>();
        headerServiceMock = jasmine.createSpyObj('HeaderService', ['changeTitle']);

        TestBed.configureTestingModule({
            declarations: [
                MapComponent,
                MapboxGlComponent,
                ToolOverlayComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([

                    {path: 'map', component: MapComponent, children: [
                        {path: 'share', component: ToolShareComponent}
                    ]},
                ]),
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ResizableModule
            ],
            providers: [
                {provide: HeaderService, useValue: headerServiceMock},
                {provide: MapStylingService, useValue: mapStylingServiceMock},
                {provide: AppConfigService, useClass: AppConfigServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('Tests related to toolbar', () => {
        beforeEach(() => {
            dh = new DOMHelper(fixture);
            fixture.detectChanges();
        });

        it('Should call onToolbarButtonClick() with a specific tool on button Click', () => {
            const mapTool: MapTool = new MapTool('map', 'basemap');
            spyOn(component, 'onToolbarButtonClick');
            dh.clickButton(mapTool.icon);
            expect(component.onToolbarButtonClick).toHaveBeenCalledWith(mapTool);
            expect(component.onToolbarButtonClick).toHaveBeenCalledTimes(1);
        });

        it('Should not display toolbar after button Click', () => {
            dh.clickButton('share');
            expect(dh.getLength('.toolbar')).toBe(0);
        });

        it('Should show a toolbar onload', () => {
            expect(fixture.debugElement.queryAll(By.css('.toolbar')).length).toBe(1);
        });

        it('should have one button for each tool', () => {
            expect(dh.getLength('.tool-button')).toBe(component.tools.length);
        });
    });

    describe('Tests related to tool overlay', () => {
        beforeEach(() => {
            dh = new DOMHelper(fixture);
            fixture.detectChanges();
        });

        it('Should not show overlay on load if no deep link is present', () => {
            expect(dh.getLength('.overlayContainer')).toBe(0);
        });

        it('Should show overlay after button click', () => {
            dh.clickButton('share');
            expect(dh.getLength('.overlayContainer')).toBe(1);
        });

        it('Should show overlay if showToolOverlay is true', () => {
            component.showToolOverlay = true;
            fixture.detectChanges();
            expect(dh.getLength('.overlayContainer')).toBe(1);
        });

        it('Should hide overlay if showToolOverlay is false',  () => {
            component.showToolOverlay = false;
            expect(dh.getLength('.overlayContainer')).toBe(0);
        });
    });

    describe('Tests related to ngOnInit', () => {

        beforeEach(() => {
        });

        it('should show overlay if a deep link is set onInit', fakeAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate(['/map/share']);
                tick();
                component.ngOnInit();
                expect(component.showToolOverlay).toBeTruthy();
            });
        }));

        it('should call load Basemap if a id is present in url', fakeAsync(() => {
            fixture.ngZone.run(() => {
                router.navigate([''], {queryParams: {id: '6d6bf638-e9cd-4a3a-b8e1-291e87135c72'}});
                tick();
                component.ngOnInit();
                expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(1);
            });
        }));

        describe('Tests related to activeStylingChanged subscription', () => {
            beforeEach(() => { });

            it('should subscription to active Styling changed', () => {
                spyOn(mapStylingServiceMock.activeStylingChanged, 'subscribe');
                component.ngOnInit();
                expect(mapStylingServiceMock.activeStylingChanged.subscribe).toHaveBeenCalledTimes(1);
            });

            it('should change activeStyling', () => {
                fixture.detectChanges();
                mapStylingServiceMock.activeStyling = {layers: [{Test: 'YO!'}]};
                mapStylingServiceMock.activeStylingChanged.emit();
                expect(component.activeStyling).toEqual({layers: [{Test: 'YO!'}]});
            });

            it('should call parseMetadata once', () => {
                fixture.detectChanges();
                spyOn(component, 'parseMetadata');
                mapStylingServiceMock.activeStylingChanged.emit();
                expect(component.parseMetadata).toHaveBeenCalledTimes(1);
            });

            it('should remove subscription', () => {
                fixture.detectChanges();
                spyOn(component.activeStylingChangedSubscription, 'unsubscribe');
                mapStylingServiceMock.activeStyling = {layers: [{Test: 'YO!'}]};
                mapStylingServiceMock.activeStylingChanged.emit();
                expect(component.activeStylingChangedSubscription.unsubscribe).toHaveBeenCalledTimes(1);
            });
        });

        describe('Tests related to activeBasemapChanged subscription', () => {
            mapView = new MapView(10, [10, 20], 10, 10);

            beforeEach(() => { });

            it('should subscription to activeBasemapChanged', () => {

                spyOn(mapStylingServiceMock.activeBasemapChanged, 'subscribe');
                component.ngOnInit();
                expect(mapStylingServiceMock.activeBasemapChanged.subscribe).toHaveBeenCalledTimes(1);
            });

            it('should call parseMetadata once', () => {
                fixture.detectChanges();
                spyOn(component, 'parseMetadata');
                mapStylingServiceMock.activeBasemapChanged.emit(mapView);
                expect(component.parseMetadata).toHaveBeenCalledTimes(1);
            });

            it('should change activeStyling', () => {
                fixture.detectChanges();
                mapStylingServiceMock.activeStyling = {layers: [{Test: 'YO!'}]};
                mapStylingServiceMock.activeBasemapChanged.emit(mapView);
                expect(component.activeStyling).toEqual({layers: [{Test: 'YO!'}]});
            });
        });

    });

    describe('Tests related to parseMetadata method', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should emit metadataChanged on mapFunctionService once', () => {
            component.activeStyling = {layers: [{Test: 'YO!'}]};
            const mapFunctionService = TestBed.inject(MapFunctionService) as MapFunctionServiceStub;
            spyOn(mapFunctionService.metadataChanged, 'emit');
            component.parseMetadata();
            expect(mapFunctionService.metadataChanged.emit).toHaveBeenCalledTimes(1);
        });

        it('should set hasGuiLayers to true if map-editor metadata of layer is "layer"', () => {
            component.activeStyling = { layers: [{ metadata: {'map-editor:layer': 'Meer' } }] };
            component.parseMetadata();
            expect(component.hasGuiLayers).toBeTruthy();
        });

        it('should set mapFunctionService.guiLayerState to true if map-editor metadata of layer is "layer"', () => {
            const mapFunctionService = TestBed.inject(MapFunctionService) as MapFunctionServiceStub;
            component.activeStyling = { layers: [{ metadata: {'map-editor:layer': 'Meer' } }] };
            component.parseMetadata();
            expect(mapFunctionService.guiLayerState).toBeTruthy();
        });

        it('should set showGroupConfiguration to true if map-editor:group and map-editor:detail-level is present in metadata', () => {
            component.activeStyling = {
                layers: [ {
                    metadata: {
                        'map-editor:group': 'Landnutzung',
                        'map-editor:detail-level': 1,
                    }
                }]
            };
            component.parseMetadata();
            expect(component.showGroupConfiguration).toBeTruthy();
        });

        it('should set mapFunctionService.guiLayerState to true if map-editor metadata of layer is "layer"', () => {
            component.activeStyling = {
                layers: [ {
                    metadata: {
                        'map-editor:group': 'Landnutzung',
                        'map-editor:detail-level': 1,
                    }
                }]
            };
            const mapFunctionService = TestBed.inject(MapFunctionService) as MapFunctionServiceStub;
            component.parseMetadata();
            expect(mapFunctionService.groupLayerState).toBeTruthy();
        });

        it('should call break if hasGuiLayers === true && showGroupConfiguration === true', () => {
            component.activeStyling = {
                layers: [ {
                    metadata: {
                    'map-editor:layer': 'Meer' ,
                    'map-editor:group': 'Landnutzung',
                    'map-editor:detail-level': 1,
                    }
                }]
            };
            component.parseMetadata();
            expect(component.showGroupConfiguration).toBeTruthy();
            expect(component.hasGuiLayers).toBeTruthy();
        });
    });

    describe('Tests related to onResizeToolOverlay method', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should set height value for overlay', () => {
            component.onResizeToolOverlay(600);
            expect(component.toolOverlayHeight).toBe(600);
        });
    });

    describe('Tests related to onCloseToolOverlay method', () => {
        beforeEach(() => {
            dh = new DOMHelper(fixture);
            component.showToolOverlay = true;
        });

        it('should close tool overlay', () => {
            fixture.ngZone.run(() => {
                fixture.detectChanges();
                component.onCloseToolOverlay();
                expect(dh.getLength('.overlayContainer')).toBe(0);
            });
        });

        it('should emit Title', () => {
            fixture.ngZone.run(() => {
                component.onCloseToolOverlay();
                expect(headerServiceMock.changeTitle).toHaveBeenCalledTimes(1);
                expect(headerServiceMock.changeTitle).toHaveBeenCalledWith(component.headerTitle);
            });
        });

        it('should route to /map', () => {
            fixture.ngZone.run(() => {
                spyOn(router, 'navigateByUrl');
                component.onCloseToolOverlay();
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map']), {skipLocationChange: false});
            });
        });
    });

    describe('Tests related to routing', () => {
        beforeEach(() => {
            dh = new DOMHelper(fixture);
            fixture.detectChanges();
        });

        it('Should navigate to / before click on toolbar-btn',
            () => {
                expect(location.path()).toBe('');
            });

        it('Should navigate to /map/basemap on toolbar-btn[0] click', () => {
            spyOn(router, 'navigateByUrl');
            fixture.ngZone.run(() => {
                dh.clickButton('map');
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/basemap']), {skipLocationChange: false});
            });
        });

        it('Should navigate to /map/edit on toolbar-btn[1] click', () => {
            spyOn(router, 'navigateByUrl');
            fixture.ngZone.run(() => {
                dh.clickButton('layers');
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/edit']), {skipLocationChange: false});
            });
        });

        it('Should navigate to /map/functions on toolbar-btn[2] click', () => {
            fixture.ngZone.run(() => {
                spyOn(router, 'navigateByUrl');
                dh.clickButton('settings');
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/functions']), {skipLocationChange: false});
            });
        });

        it('Should navigate to /map/share on toolbar-btn[3] click', () => {
            fixture.ngZone.run(() => {
                spyOn(router, 'navigateByUrl');
                dh.clickButton('share');
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/share']), {skipLocationChange: false});
            });
        });

    });
});

class MapFunctionServiceStub{
    mapFunctionsChanged = new EventEmitter<string>();
    guiLayerState: boolean;
    groupLayerState: boolean;
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
    metadataChanged = new EventEmitter<string>();
}

class AppConfigServiceStub{
    settings: SettingsModel = {
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
    } as SettingsModel;
}

@Component({template: ''})
class DummyComponent { }
