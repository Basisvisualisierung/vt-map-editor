import {TestBed, inject, fakeAsync, tick, getTestBed} from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapStylingService } from './map-styling.service';
import {ActivatedRoute} from '@angular/router';
import {AppConfigService} from '../app-config.service';
import createSpyObj = jasmine.createSpyObj;
import {Basemap} from '../shared/basemap';
import {MapView} from '../shared/mapview';

describe('MapStylingService', () => {
    let mapStylingService: MapStylingService;
    let appConfigServiceMock: any;
    let httpMock: HttpTestingController;
    let styling: StylingStub;
    let basemap: Basemap;

    beforeEach(() => {
        appConfigServiceMock = createSpyObj('AppConfigService', ['initConfig']);
        appConfigServiceMock.settings = { mapService: { url: 'test'}, map: {}, basemaps: [{}]};

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MapStylingService,
                {provide: AppConfigService, useValue: appConfigServiceMock},
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => {
                                    return 'APA';
                                },
                            },
                        },
                    },
                },
            ]
        });

        styling = new StylingStub();
        httpMock = TestBed.inject(HttpTestingController);
        mapStylingService = TestBed.inject(MapStylingService);
        mapStylingService.mapUuid = null;
    });

    it('should be created', () => {
        expect(mapStylingService).toBeTruthy();
    });

    describe('Tests related to randomColors()', () => {
        beforeEach(() => {
            styling = mapStylingService.randomColors(styling);
        });

        it('should have a hsl paint property if type is not raster', () => {
            expect(styling.layers.find( x => x.id === 'Hintergrund').paint['background-color']).toContain('hsl');
        });

        it('should not have a hsl paint property if type is raster', () => {
            expect(styling.layers.find( x => x.id === 'Raster').paint['fill-color']).toEqual('#b4ddf4');
        });

        it('should set valid hsl values if type is not raster', () => {
            expect(/^hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/.test(styling.layers.find( x => x.id === 'Hintergrund').paint['background-color'])).toBeTruthy();
        });

        it('should set valid hsl values if type is not raster', () => {
            expect(/^hsl[(]\s*0*(?:[12]?\d{1,2}|3(?:[0-5]\d|60))\s*(?:\s*,\s*0*(?:\d\d?(?:\.\d+)?\s*%|\.\d+\s*%|100(?:\.0*)?\s*%)){2}\s*[)]$/.test(styling.layers.find( x => x.id === 'Schrift Wald').paint['text-color'])).toBeTruthy();
        });

        it('should at a paint property if paint is undefined for a layer', () => {
           expect(styling.layers.find(x => x.id === 'Undefined').paint).toBeTruthy();
        });
    });

    describe('Tests related to change HSL', () => {
        beforeEach(() => {
            spyOn(mapStylingService, 'changeActiveStyling');
        });

        it('should call changeActiveStyling once per call', () => {
            mapStylingService.activeStyling = styling;
            mapStylingService.changeHSL(1, 1);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledTimes(1);
        });

        it('should change rgb color to hsla and call changeActiveStyling with this changes', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGB', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                         { id: 'RGB2', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                         ], };

            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [{ id: 'RGB', type: 'background', paint: ({ 'background-color': 'hsla(324,43%,77%,1)' }) },
                                  { id: 'RGB2', type: 'fill', paint: {'fill-color': 'hsla(94,100%,60%,1)'} },
                    ] });
        });

        it('should change rgba color of all layers to hsla', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGBA', type: 'background', paint: {'background-color': 'rgba(222,173,202,0.5)'} },
                          { id: 'RGBA2', type: 'fill', paint: {'fill-color': 'rgba(140,255,52,1)'} },
                ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'RGBA', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,0.5)' } },
                                   { id: 'RGBA2', type: 'fill', paint: {'fill-color': 'hsla(94,100%,60%,1)'} },
                ] });
        });

        it('should change hex color of all layers to hsl', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'HEX', type: 'background', paint: {'background-color': '#DEADCA'} },
                          { id: 'HEX2', type: 'fill', paint: {'fill-color': '#8CFF34'} },
                          { id: 'HEX3', type: 'fill', paint: {'fill-color': '#FF0'} },
                    ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'HEX', type: 'background', paint: { 'background-color': 'hsl(324,43%,77%)' } },
                                   { id: 'HEX2', type: 'fill', paint: {'fill-color': 'hsl(94,100%,60%)'} },
                                   { id: 'HEX3', type: 'fill', paint: {'fill-color': 'hsl(60,100%,50%)'} },
                    ] });
        });

        it('should not change color values when nested in arrays', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'Array', type: 'background', paint: {'background-color': ['rgba(222, 173, 202, 1)']} }], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith({ layers: [ { id: 'Array', type: 'background', paint: {'background-color': ['rgba(222, 173, 202, 1)']} }] });
        });

        it('should convert hsl to hsla', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'HSL', type: 'background', paint: {'background-color': 'hsl(324,43%,77%)'} },
                        { id: 'HSL2', type: 'fill', paint: {'fill-color': 'hsl(94,100%,60%)'} },
                        { id: 'HSL3', type: 'fill', paint: {'fill-color': 'hsl(60,100%,50%)'} },
                    ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                {layers: [{ id: 'HSL', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,1)'} },
                                 { id: 'HSL2', type: 'fill', paint: {'fill-color': 'hsla(94,100%,60%,1)'} },
                                 { id: 'HSL3', type: 'fill', paint: {'fill-color': 'hsla(60,100%,50%,1)'} },
                ], }
            );
        });

        it('should pass hsla through', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                        { id: 'HSLA2', type: 'fill', paint: {'fill-color': 'hsla(94,100%,60%,0.7)'} },
                        { id: 'HSLA3', type: 'fill', paint: {'fill-color': 'hsla(60,100%,50%,0.3)'} },
                    ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                {layers: [{ id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                        { id: 'HSLA2', type: 'fill', paint: {'fill-color': 'hsla(94,100%,60%,0.7)'} },
                        { id: 'HSLA3', type: 'fill', paint: {'fill-color': 'hsla(60,100%,50%,0.3)'} },
                    ], }
            );
        });

        it('should pass through if color type is unsupported', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'HSLA', type: 'background', paint: {'background-color': 'hsb(324,43%,77%,0.4)'} },
                        { id: 'HSLA2', type: 'fill', paint: {'fill-color': 'hsb(94,100%,60%,0.7)'} },
                        { id: 'HSLA3', type: 'fill', paint: {'fill-color': 'hsb(60,100%,50%,0.3)'} },
                    ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                {layers: [{ id: 'HSLA', type: 'background', paint: {'background-color': 'hsb(324,43%,77%,0.4)'} },
                        { id: 'HSLA2', type: 'fill', paint: {'fill-color': 'hsb(94,100%,60%,0.7)'} },
                        { id: 'HSLA3', type: 'fill', paint: {'fill-color': 'hsb(60,100%,50%,0.3)'} },
                    ], }
            );
        });

        it('should add a blind hsl value if no paint property is set for a layer', () => {
            mapStylingService.activeStyling = {layers: [ { id: 'Undefined', type: 'fill'} ], };
            mapStylingService.changeHSL(0, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith({ layers: [ ({ id: 'Undefined', type: 'fill', paint: ({ 'fill-color': 'hsl(0,0%,0%)' }) }) ] });
        });

        it('should be possible to raise lightness for every type of supported colors', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGB', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                          { id: 'RGBA', type: 'background', paint: {'background-color': 'rgba(222,173,202,0.5)'} },
                          { id: 'HEX', type: 'background', paint: {'background-color': '#DEADCA'} },
                          { id: 'HEX3', type: 'fill', paint: {'fill-color': '#FF0'} },
                          { id: 'HSL', type: 'background', paint: {'background-color': 'hsl(324,43%,77%)'} },
                          { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                    ], };
            mapStylingService.changeHSL(1, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'RGB', type: 'background', paint: {'background-color': 'hsla(324,44%,77%,1)'} },
                                   { id: 'RGBA', type: 'background', paint: {'background-color': 'hsla(324,44%,77%,0.5)'} },
                                   { id: 'HEX', type: 'background', paint: {'background-color': 'hsl(324,44%,77%)'} },
                                   { id: 'HEX3', type: 'fill', paint: {'fill-color': 'hsl(60,101%,50%)'} },
                                   { id: 'HSL', type: 'background', paint: {'background-color': 'hsla(324,44%,77%,1)'} },
                                   { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,44%,77%,0.4)'} },

                    ] });
        });

        it('should be possible to lower lightness for every type of supported colors', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGB', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'rgba(222,173,202,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': '#DEADCA'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': '#FF0'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsl(324,43%,77%)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                    ], };
            mapStylingService.changeHSL(-3, 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'RGB', type: 'background', paint: {'background-color': 'hsla(324,40%,77%,1)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'hsla(324,40%,77%,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': 'hsl(324,40%,77%)'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': 'hsl(60,97%,50%)'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsla(324,40%,77%,1)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,40%,77%,0.4)'} },
                    ] });
        });

        it('should be possible to raise saturation for every type of supported colors', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGB', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'rgba(222,173,202,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': '#DEADCA'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': '#FF0'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsl(324,43%,77%)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                    ], };
            mapStylingService.changeHSL(0, 2);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'RGB', type: 'background', paint: {'background-color': 'hsla(324,43%,79%,1)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'hsla(324,43%,79%,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': 'hsl(324,43%,79%)'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': 'hsl(60,100%,52%)'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsla(324,43%,79%,1)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,79%,0.4)'} },
                    ] });
        });

        it('should be possible to lower saturation for every type of supported colors', () => {
            mapStylingService.activeStyling =
                {layers: [{ id: 'RGB', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'rgba(222,173,202,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': '#DEADCA'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': '#FF0'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsl(324,43%,77%)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,77%,0.4)'} },
                    ], };
            mapStylingService.changeHSL(0, -6);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(
                { layers: [ { id: 'RGB', type: 'background', paint: {'background-color': 'hsla(324,43%,71%,1)'} },
                        { id: 'RGBA', type: 'background', paint: {'background-color': 'hsla(324,43%,71%,0.5)'} },
                        { id: 'HEX', type: 'background', paint: {'background-color': 'hsl(324,43%,71%)'} },
                        { id: 'HEX3', type: 'fill', paint: {'fill-color': 'hsl(60,100%,44%)'} },
                        { id: 'HSL', type: 'background', paint: {'background-color': 'hsla(324,43%,71%,1)'} },
                        { id: 'HSLA', type: 'background', paint: {'background-color': 'hsla(324,43%,71%,0.4)'} },
                    ] });
        });
    });

    describe('Tests related to changeActiveStyling()', () => {
        beforeEach(() => {});

        it('should set a given styling to activeStyling', () => {
            const style = { layers: [{ id: 'Test'}]};
            mapStylingService.changeActiveStyling(style);
            expect(mapStylingService.activeStyling).toEqual({ layers: [{ id: 'Test'}]});
        });

        it('should emit activeStylingChanged', () => {
            spyOn(mapStylingService.activeStylingChanged, 'emit');
            const style = { layers: [{ id: 'Test'}]};
            mapStylingService.changeActiveStyling(style);
            expect(mapStylingService.activeStylingChanged.emit).toHaveBeenCalledTimes(1);
        });

        it('should emit activeStylingChanged with a given styling', () => {
            spyOn(mapStylingService.activeStylingChanged, 'emit');
            const style = { layers: [{ id: 'Test'}]};
            mapStylingService.changeActiveStyling(style);
            expect(mapStylingService.activeStylingChanged.emit).toHaveBeenCalledWith({ layers: [{ id: 'Test'}]});
        });
    });

    describe('Tests related to changeActiveBasemap()', () => {
        beforeEach(() => {
            basemap = new Basemap('Test', 'http://test.de', '', 'a test Basemap', false);
        });

        it('should set a given basemap as activeBasemap', () => {
            mapStylingService.changeActiveBasemap(basemap, false);
            expect(mapStylingService.activeBasemap).toEqual(basemap);
        });

        it('should call setActivatedStyling with true and a given value for changeMapView', () => {
            spyOn(mapStylingService, 'setActiveStylingJson');
            mapStylingService.changeActiveBasemap(basemap, false);
            expect(mapStylingService.setActiveStylingJson).toHaveBeenCalledWith(true, false);
        });

        it('should call setActivatedStyling with true and a given value for changeMapView', () => {
            spyOn(mapStylingService, 'setActiveStylingJson');
            mapStylingService.changeActiveBasemap(basemap, true);
            expect(mapStylingService.setActiveStylingJson).toHaveBeenCalledWith(true, true);
        });

        it('should call setActivatedStyling once', () => {
            spyOn(mapStylingService, 'setActiveStylingJson');
            mapStylingService.changeActiveBasemap(basemap, false);
            expect(mapStylingService.setActiveStylingJson).toHaveBeenCalledTimes(1);
        });
    });

    describe('Tests related to setActiveStylingJson()', () => {
        beforeEach(() => { });

        describe('basemapChanged and random colors are true', () => {

            beforeEach(() => {
                mapStylingService.activeStyling = styling;
                basemap = new Basemap('Random Colors', '', 'assets/basemaps/style.json', '', true);
                mapStylingService.activeBasemap = basemap;
            });

            it('should emit  basemapChanged', () => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                mapStylingService.setActiveStylingJson(true, false);
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledTimes(1);
            });

            it('should emit null on basemapChanged emitter', () => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                mapStylingService.setActiveStylingJson(true, false);
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledWith(null);
            });

            it('should call changeActiveStyling()', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.setActiveStylingJson(true, false);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledTimes(1);
            });

            it('should call changeActiveStyling() with a random color styling', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.setActiveStylingJson(true, false);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(mapStylingService.randomColors(styling));
            });
        });

        describe('randomColors false, basemapChanged false', () => {
            const style = { layers: [{ id: 'Test'}]};

            beforeEach(() => {
                mapStylingService.activeStyling = styling;
                basemap = new Basemap('Random Colors', 'http://test.de', 'assets/basemaps/style.json', 'beschreibung', false);
                mapStylingService.activeBasemap = basemap;
                mapStylingService.setActiveStylingJson(false, false);
            });

            it('should request styling of this active basemap',  fakeAsync(() => {
                spyOn(mapStylingService, 'changeActiveStyling');
                const request = httpMock.expectOne({ method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(style);
            }));
        });

        describe('basemapChanged true', () => {
            const style = {layers: [{id: 'Test'}]};

            beforeEach(() => {
                mapStylingService.activeStyling = styling;
                basemap = new Basemap('Random Colors', 'http://test.de', 'assets/basemaps/style.json', 'beschreibung', false);
                mapStylingService.activeBasemap = basemap;
                mapStylingService.setActiveStylingJson(true);
            });

            it('should request styling of this active basemap', fakeAsync(() => {
                spyOn(mapStylingService, 'changeActiveStyling');
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(style);
            }));

            it('should reset styling of this active basemap', fakeAsync(() => {
                spyOn(mapStylingService, 'changeActiveStyling');
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(style);
            }));

            it('should reset groupSettings', fakeAsync(() => {
                mapStylingService.groupSettings = {test: 'YO'};
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.groupSettings).toEqual({});
            }));

            it('should reset guiLayerSettings', fakeAsync(() => {
                mapStylingService.guiLayerSettings = {test: 'YO'};
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.guiLayerSettings).toEqual({});
            }));

            it('should emit activeBasemapChanged with null', fakeAsync(() => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledWith(null);
            }));

            it('should emit activeBasemapChanged once', fakeAsync(() => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                const request = httpMock.expectOne({method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledTimes(1);
            }));
        });
        describe('changeMapview ture', () => {
            const style = { zoom: 1, center: [23, 45], pitch: 9, bearing: 8, layers: [{ id: 'Test'}]};

            beforeEach(() => {
                mapStylingService.activeStyling = style;
                basemap = new Basemap('Random Colors', 'http://test.de', 'assets/basemaps/style.json', 'beschreibung', false);
                mapStylingService.activeBasemap = basemap;
                mapStylingService.setActiveStylingJson(true, true);
            });

            it('should reset guiLayerSettings',  fakeAsync(() => {
                const request = httpMock.expectOne({ method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.guiLayerSettings).toEqual({});
            }));

            it('should emit activeBasemapChanged once',  fakeAsync(() => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                const request = httpMock.expectOne({ method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledTimes(1);
            }));

            it('should emit activeBasemapChanged with zoom pitch ...',  fakeAsync(() => {
                spyOn(mapStylingService.activeBasemapChanged, 'emit');
                const request = httpMock.expectOne({ method: 'GET', url: 'assets/basemaps/style.json'});
                request.flush(style);
                tick();
                httpMock.verify();
                const mapView = new MapView(1, [23, 45], 9, 8);
                expect(mapStylingService.activeBasemapChanged.emit).toHaveBeenCalledWith(mapView);
            }));
        });
    });

    describe('Tests related to addBasemap()', () => {

        beforeEach(() => {
            basemap = new Basemap('Farbe', 'assets/basemaps/thumbnails/basemap_standard.png', 'test/style/Farbe', undefined, undefined);
        });

        it('should return a Basemap', () => {
            const returnValue = mapStylingService.addBasemap('Farbe', false, false);
            expect(returnValue).toEqual(basemap);
        });

        describe('activateBasemap true', () => {

            beforeEach(() => {
                spyOn(mapStylingService, 'changeActiveBasemap');
                mapStylingService.addBasemap('Farbe', true, false);
            });

            it('should call changeActiveBasemap() once', () => {
                expect(mapStylingService.changeActiveBasemap).toHaveBeenCalledTimes(1);
            });

            it('should call changeActiveBasemap with basemap an changeMapView Value', () => {
                expect(mapStylingService.changeActiveBasemap).toHaveBeenCalledWith(basemap, false);
            });
        });

    });

    describe('Tests related to changeMapView()', () => {

        beforeEach(() => {
            mapStylingService.mapView = new MapView(1, [2, 4], 3, 4);
        });

        it('should change mapView center if called with center and a value', () => {
            mapStylingService.changeMapView('center', [1, 2]);
            expect(mapStylingService.mapView.center).toEqual([1, 2]);
        });

        it('should change mapView zoom if called with zoom and a value', () => {
            mapStylingService.changeMapView('zoom', 5);
            expect(mapStylingService.mapView.zoom).toEqual(5);
        });

        it('should change mapView pitch if called with pitch and a value', () => {
            mapStylingService.changeMapView('pitch', 9);
            expect(mapStylingService.mapView.pitch).toEqual(9);
        });

        it('should change mapView bearing if called with bearing and a value', () => {
            mapStylingService.changeMapView('bearing', 2);
            expect(mapStylingService.mapView.bearing).toEqual(2);
        });

        it('should not add keys if it is called with a unknown key', () => {
            mapStylingService.changeMapView('blub', 2);
            const containsBlub = mapStylingService.mapView['blub'];
            expect(containsBlub).toBeFalsy();
        });
    });

    describe('Tests related to changeLayerVisibility()', () => {

        beforeEach(() => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
        });

        it('should call changeActiveStyling with activeStyling if layer id do not exist', () => {
            const styleCheck = {
                layers: [
                    { id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerVisibility('notAId', true);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        describe('visible true', () => {

            it('should change visibility of a given layer to true if there is no layout value', () => {
                const styleCheck = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'visible' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeLayerVisibility('makeVisible', true);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });

            it('should change visibility of a given layer to true if there is a layout value', () => {
                mapStylingService.activeStyling = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'none' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ]
                };
                const styleCheck = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'visible' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeLayerVisibility('makeVisible', true);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

        describe('visible false', () => {

            it('should change visibility of a given layer to true if there is no layout value', () => {
                const styleCheck = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'none' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeLayerVisibility('makeVisible', false);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });

            it('should change visibility of a given layer to true if there is a layout value', () => {
                mapStylingService.activeStyling = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'visible' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ]
                };
                const styleCheck = {
                    layers: [
                        {id: 'makeVisible', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: { visibility: 'none' } },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeLayerVisibility('makeVisible', false);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });
    });

    describe('Tests related to changeLayerAttribute()', () => {

        beforeEach(() => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'changeAttribute', type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
        });

        it('should set a value for a not existing key of a layer', () => {
            const styleCheck = {
                layers: [
                    { id: 'changeAttribute', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, newKey: 'newValue' },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerAttribute('changeAttribute', 'newKey', 'newValue');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        it('should set a value for a not existing deep key of a layer', () => {
            const styleCheck = {
                layers: [
                    { id: 'changeAttribute', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, newKey: { newDeepKey: 'newValue' }},
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerAttribute('changeAttribute', 'newKey.newDeepKey', 'newValue');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        it('should set a value for a  existing deep attribute path', () => {
            const styleCheck = {
                layers: [
                    { id: 'changeAttribute', type: 'background', paint: {'background-color': 'rgb(222,173,201)'}},
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerAttribute('changeAttribute', 'paint.background-color', 'rgb(222,173,201)');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        it('should set a value for a existing key of of a layer', () => {
            const styleCheck = {
                layers: [
                    { id: 'changeAttribute', type: 'newValue', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerAttribute('changeAttribute', 'type', 'newValue');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        it('should call changeActiveStyling() with activeStyling of mapStylingService if layer do not exist', () => {
            const styleCheck = {
                layers: [
                    { id: 'changeAttribute', type: 'background', paint: {'background-color': 'rgb(222,173,202)'}},
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeLayerAttribute('notExistingLayer', 'type', 'newValue');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });
    });

    describe('Tests related to changeGroupDetailLevel()', () => {

        beforeEach(() => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer2', metadata: {'map-editor:group': 'testGroup2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer3', metadata: {'map-editor:group': 'testGroup3', 'map-editor:detail-level': 3},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            mapStylingService.groupSettings = { testGroup1: {detailLevel: 1}};
        });

        it('should add group to groupSettings if it not exists', () => {
            mapStylingService.changeGroupDetailLevel('testGroup2', 2);
            expect(mapStylingService.groupSettings).toEqual({ testGroup1: {detailLevel: 1}, testGroup2: {detailLevel: 2}});
        });

        it('should change detail level if exists in groupSettings', () => {
            mapStylingService.changeGroupDetailLevel('testGroup1', 2);
            expect(mapStylingService.groupSettings).toEqual({ testGroup1: {detailLevel: 2}});
        });

        it('should call changeActiveStyling once', () => {
           spyOn(mapStylingService, 'changeActiveStyling');
           mapStylingService.changeGroupDetailLevel('testGroup1', 2);
           expect(mapStylingService.changeActiveStyling).toHaveBeenCalledTimes(1);
        });

        it('should set layout of layer if not present', () => {
            const styleCheck = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer2', metadata: {'map-editor:group': 'testGroup2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer3', metadata: {'map-editor:group': 'testGroup3', 'map-editor:detail-level': 3},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeGroupDetailLevel('testGroup3', 2);

            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        it('should not change visibility if no detailLevel is present', () => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1'},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                ],
            };
            const styleCheck = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1'},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                ],
            };
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeGroupDetailLevel('testGroup1', 0);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
        });

        describe('group name not present', () => {

            it('should call changeActiveStyling with unchanged styling', () => {
                mapStylingService.activeStyling = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1'},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    ],
                };
                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1'},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGroupDetailLevel('notExistingGroup', 2);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

        describe('detailLevel of layer is <= detail level of method call', () => {
            const styleCheck = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer2', metadata: {'map-editor:group': 'testGroup2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer3', metadata: {'map-editor:group': 'testGroup3', 'map-editor:detail-level': 3},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };

            it('should set visibility to visible', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGroupDetailLevel('testGroup2', 2);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

        describe('detailLevel of layer is > detail level of method call', () => {

            const styleCheck = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:group': 'testGroup1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer2', metadata: {'map-editor:group': 'testGroup2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer3', metadata: {'map-editor:group': 'testGroup3', 'map-editor:detail-level': 3},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };

            it('should set visibility to visible', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGroupDetailLevel('testGroup1', 0);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });
    });

    describe('Tests related to changeGuiLayerVisibility()', () => {

        beforeEach(() => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer2', metadata: {'map-editor:layer': 'testGroup2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer3', metadata: {'map-editor:layer': 'testGroup3', 'map-editor:detail-level': 3},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'} },
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
        });

        it('should call changeActiveStyling() once', () => {
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeGuiLayerVisibility('testLayerName', true);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledTimes(1);
        });

        it('should call changeActiveStyling() with a styling', () => {
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeGuiLayerVisibility('testLayerName', true);
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(mapStylingService.activeStyling);
        });

        describe('guiLayer is not present in guiLayerSettings', () => {

            it('should add guiLayer to guiLayerSettings if it is not present', () => {
                mapStylingService.changeGuiLayerVisibility('testLayerName', true);
                expect(mapStylingService.guiLayerSettings.testLayerName).toBeTruthy();
            });

            it('should set visible of this guiLayerName to visible on gui layer settings', () => {
                mapStylingService.changeGuiLayerVisibility('testLayerName', true);
                expect(mapStylingService.guiLayerSettings.testLayerName.visible).toEqual(true);
            });
        });

        describe('guiLayer is present in guiLayerSettings', () => {

            it('should set visible of this guiLayerName to visible on gui layer settings', () => {
                mapStylingService.guiLayerSettings = { testLayerName: { visible: false} };
                mapStylingService.changeGuiLayerVisibility('testLayerName', true);
                expect(mapStylingService.guiLayerSettings.testLayerName.visible).toEqual(true);
            });

        });

        describe('guiLayerName is present in metadata of active Styling as "map-editor:layer"', () => {


            it('should set layout key if it is undefined', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.activeStyling = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testLayerName', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}
                        },
                    ],
                };
                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testLayerName', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'}
                        },
                    ],
                };
                mapStylingService.changeGuiLayerVisibility('testLayerName', true);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });

            it('should change visibility value if it is still present ', () => {
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.activeStyling = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testLayerName', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'}
                        },
                    ],
                };
                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testLayerName', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'}
                        },
                    ],
                };
                mapStylingService.changeGuiLayerVisibility('testLayerName', false);
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

    });

    describe('Tests related to changeGuiLayerColor()', () => {

        beforeEach(() => {
            mapStylingService.activeStyling = {
                layers: [
                    { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                    { id: 'groupLayer2', metadata: {'map-editor:layer': 'testGroup2', 'map-editor:layer-element': 'testElement2', 'map-editor:detail-level': 2},
                        type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                    { id: 'groupLayer3', metadata: {'map-editor:layer': 'testGroup3', 'map-editor:layer-element': 'testElement3', 'map-editor:detail-level': 3},
                        type: 'background'},
                    { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                ],
            };
        });

        it('should call changeActiveStyling once', () => {
            spyOn(mapStylingService, 'changeActiveStyling');
            mapStylingService.changeGuiLayerColor('noGuiLayerName', 'noElementName', 'noColorString');
            expect(mapStylingService.changeActiveStyling).toHaveBeenCalledTimes(1);
        });

        describe('no paint Property present', () => {

            it('should set paint property of layer', () => {
                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                        { id: 'groupLayer2', metadata: {'map-editor:layer': 'testGroup2', 'map-editor:layer-element': 'testElement2', 'map-editor:detail-level': 2},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'none'} },
                        { id: 'groupLayer3', metadata: {'map-editor:layer': 'testGroup3', 'map-editor:layer-element': 'testElement3', 'map-editor:detail-level': 3},
                            type: 'background', paint: {'background-color': 'yellow'} },
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGuiLayerColor('testGroup3', 'testElement3', 'yellow');
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

        describe('paint property present', () => {

            it('should change paint property', () => {
                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'background', paint: {'background-color': 'rgb(222,173,202)'}, layout: {visibility: 'visible'} },
                        { id: 'groupLayer2', metadata: {'map-editor:layer': 'testGroup2', 'map-editor:layer-element': 'testElement2', 'map-editor:detail-level': 2},
                            type: 'background', paint: {'background-color': 'yellow'}, layout: {visibility: 'none'} },
                        { id: 'groupLayer3', metadata: {'map-editor:layer': 'testGroup3', 'map-editor:layer-element': 'testElement3', 'map-editor:detail-level': 3},
                            type: 'background'},
                        { id: 'test', type: 'fill', paint: {'fill-color': 'rgb(140,255,52)'} },
                    ],
                };
                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGuiLayerColor('testGroup2', 'testElement2', 'yellow');
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });

        describe('layerType = symbol', () => {

            it('should set paint property text-color', () => {
                mapStylingService.activeStyling = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'symbol'},
                    ],
                };

                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'symbol', paint: {'text-color': 'yellow'} },
                    ],
                };

                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGuiLayerColor('testGroup1', 'testElement1', 'yellow');
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });

        });

        describe('color is rgba', () => {

            it('should set paint property opacity to alpha value', () => {
                mapStylingService.activeStyling = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'symbol'},
                    ],
                };

                const styleCheck = {
                    layers: [
                        { id: 'groupLayer', metadata: {'map-editor:layer': 'testGroup1', 'map-editor:layer-element': 'testElement1', 'map-editor:detail-level': 1},
                            type: 'symbol', paint: {'text-color': 'rgba(122,33,12, 1)', 'text-opacity': 1} },
                    ],
                };

                spyOn(mapStylingService, 'changeActiveStyling');
                mapStylingService.changeGuiLayerColor('testGroup1', 'testElement1', 'rgba(122,33,12,1)');
                expect(mapStylingService.changeActiveStyling).toHaveBeenCalledWith(styleCheck);
            });
        });
    });

    describe('Tests related to changeColorToSupportedColor()', () => {

        describe('opacity not set', () => {

            describe('color is rgba', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('rgba(122,33,44,0.3)');
                    expect(color).toEqual('rgba(122,33,44,0.3)');
                });
            });

            describe('color is rgb', () => {
                it('should return a rgba color with alpha = 1', () => {
                    const color = mapStylingService.changeColorToSupported('rgb(122,33,44)');
                    expect(color).toEqual('rgba(122,33,44, 1)');
                });
            });

            describe('color is hex', () => {
                it('should return a rgba color with alpha = 1', () => {
                    const color = mapStylingService.changeColorToSupported('#773342');
                    expect(color).toEqual('rgba(119,51,66,1)');
                });
            });

            describe('color is short hex', () => {
                it('should return a rgba color with alpha = 1', () => {
                    const color = mapStylingService.changeColorToSupported('#732');
                    expect(color).toEqual('rgba(119,51,34,1)');
                });
            });

            describe('color is hsla', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('hsla(340,10%,9%,0.1)');
                    expect(color).toEqual('hsla(340,10%,9%,0.1)');
                });
            });

            describe('color is hsl', () => {
                it('should return a hsla color with alpha = 1', () => {
                    const color = mapStylingService.changeColorToSupported('hsl(340,10%,9%)');
                    expect(color).toEqual('hsla(340,10%,9%, 1)');
                });
            });

            describe('color is HTML color', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('yellow');
                    expect(color).toEqual('yellow');
                });
            });
        });

        describe('opacity set', () => {

            describe('color is rgba', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('rgba(122,33,44,0.3)', 0.7);
                    expect(color).toEqual('rgba(122,33,44,0.3)');
                });
            });

            describe('color is rgb', () => {
                it('should return a rgba color with alpha = opacity', () => {
                    const color = mapStylingService.changeColorToSupported('rgb(122,33,44)', 0.7);
                    expect(color).toEqual('rgba(122,33,44, 0.7)');
                });
            });

            describe('color is hex', () => {
                it('should return a rgba color with alpha = opacity', () => {
                    const color = mapStylingService.changeColorToSupported('#773342', 0.7);
                    expect(color).toEqual('rgba(119,51,66,0.7)');
                });
            });

            describe('color is short hex', () => {
                it('should return a rgba color with alpha = opacity', () => {
                    const color = mapStylingService.changeColorToSupported('#732', 0.7);
                    expect(color).toEqual('rgba(119,51,34,0.7)');
                });
            });

            describe('color is hsla', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('hsla(340,10%,9%,0.1)', 0.7);
                    expect(color).toEqual('hsla(340,10%,9%,0.1)');
                });
            });

            describe('color is hsl', () => {
                it('should return a hsla color with alpha = opacity', () => {
                    const color = mapStylingService.changeColorToSupported('hsl(340,10%,9%)', 0.7);
                    expect(color).toEqual('hsla(340,10%,9%, 0.7)');
                });
            });

            describe('color is HTML color', () => {
                it('should return color input', () => {
                    const color = mapStylingService.changeColorToSupported('yellow', 0.7);
                    expect(color).toEqual('yellow');
                });
            });
        });
    });
});


class StylingStub{
    layers = [
        {
            id: 'Hintergrund',
            type: 'background',
            paint: {
                'background-color': '#fafaf3'
            }
        },
        {
            id: 'Undefined',
            type: 'background',
        },
        {
            id: 'RGBA',
            type: 'background',
            paint: {
                'background-color': 'rgb(255, 255, 0, 1)'
            }
        },
        {
            id: 'RGB',
            type: 'background',
            paint: {
                'background-color': 'rgb(255, 255, 0, 1)'
            }
        },
        {
            id: 'Meer',
            type: 'fill',
            paint: {
                'fill-color': '#b4ddf4',
                'fill-opacity': 0.5
            }
        },
        {
            id: 'Raster',
            type: 'raster',
            paint: {
                'fill-color': '#b4ddf4',
                'fill-opacity': 0.5
            }
        },
        {
            id: 'Schrift Wald',
            type: 'symbol',
            paint: {
                'text-color': '#3ca432'
            }
        },
    ];
}
