import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEditComponent } from './tool-edit.component';
import {HeaderService} from '../../../header/header.service';
import {MapStylingService} from '../../map-styling.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MapFunctionService} from '../../map-function.service';
import {EventEmitter} from '@angular/core';
import {MaterialDesignModule} from '../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayerConfigurationComponent} from './layer/layer-configuration.component';
import {LayerElementComponent} from './layer/layer-element.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MapComponent} from '../../map.component';
import {ToolShareComponent} from '../tool-share/tool-share.component';
import {ToolBasemapComponent} from '../tool-basemap/tool-basemap.component';
import {GroupConfigurationComponent} from './group-configuration/group-configuration.component';
import {GuiLayerConfigurationComponent} from './gui-layer/gui-layer-configuration.component';
import {ToolFunctionsComponent} from '../tool-functions/tool-functions.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Location} from '@angular/common';


describe('ToolEditComponent', () => {
    let component: ToolEditComponent;
    let fixture: ComponentFixture<ToolEditComponent>;
    let mapFunctionServiceMock: any;
    let headerServiceMock: any;
    let mapStylingServiceMock: any;

    beforeEach(async(() => {
        mapFunctionServiceMock = jasmine.createSpyObj('MapFunctionService', ['guiLayerState', 'groupLayerState']);
        mapFunctionServiceMock.metadataChanged = new EventEmitter<any>();
        headerServiceMock = jasmine.createSpyObj('HeaderService', ['changeTitle']);
        mapStylingServiceMock = jasmine.createSpyObj('MapStylingService', ['']);
        mapStylingServiceMock.activeStylingChanged = new EventEmitter<string>();
        mapStylingServiceMock.activeStyling = {layers: [{}]};

        TestBed.configureTestingModule({
            declarations: [
                ToolEditComponent,
                LayerConfigurationComponent,
                LayerElementComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    {path: 'map', component: MapComponent, children: [
                            {path: 'basemap', component: ToolBasemapComponent},
                            {path: 'edit', component: ToolEditComponent, children: [
                                    {path: 'group-layer', component: GroupConfigurationComponent},
                                    {path: 'gui-layer', component: GuiLayerConfigurationComponent},
                                    {path: 'layer', component: LayerConfigurationComponent}
                                ]},
                            {path: 'functions', component: ToolFunctionsComponent},
                            {path: 'share', component: ToolShareComponent}
                        ]},
                ]),
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                {provide: HeaderService, useValue: headerServiceMock},
                {provide: MapStylingService, useValue: mapStylingServiceMock},
                {provide: MapFunctionService, useValue: mapFunctionServiceMock},
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolEditComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('Test routes depending on the styling layers', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });
        it('should route to /map/edit/gui-layer if there are no group layer but gui-layer in the active styling and there is not a deep link',
            () => {
                fixture.ngZone.run(() => {
                    mapFunctionServiceMock.guiLayerState = true;
                    mapFunctionServiceMock.groupLayerState = false;
                    component.deepLink = false;
                    const router = TestBed.inject(Router);
                    spyOn(router, 'navigateByUrl');
                    component.editSection();
                    expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/edit/gui-layer']), {replaceUrl: true});
                });
            });

        it('should route to /map/edit/layer if no group layer and no gui Layer in the active styling and there is not a deep link',
            () => {
                mapFunctionServiceMock.guiLayerState = false;
                mapFunctionServiceMock.groupLayerState = false;
                component.deepLink = false;
                const router = TestBed.inject(Router);
                spyOn(router, 'navigateByUrl');
                component.editSection();
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/edit/layer']), { replaceUrl: true });
            });

        it('should route to /map/edit/group-layer if no group layer present in the active styling and there is not a deep link',
            () => {
                mapFunctionServiceMock.groupLayerState = true;
                component.deepLink = false;
                const router = TestBed.inject(Router);
                spyOn(router, 'navigateByUrl');
                component.editSection();
                expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/edit/group-layer']), { replaceUrl: true });
            });

        it('should not route if there is a deep link',
            () => {
                component.deepLink = true;
                const router = TestBed.inject(Router);
                spyOn(router, 'navigateByUrl');
                fixture.detectChanges();
                component.editSection();
                expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
            });

    });
    describe('Test ngOnInit', () => {

        it('should call changeTitle from header service once', () => {
            fixture.ngZone.run(() => {
                component.ngOnInit();
                expect(headerServiceMock.changeTitle).toHaveBeenCalledTimes(1);
            });
        });

        it('should have called edit section once on ngOnInit', () => {
            spyOn(component, 'editSection');
            component.ngOnInit();
            expect(component.editSection).toHaveBeenCalledTimes(1);
        });
    });

    describe('Test Async calls', () => {
        let location: Location;
        let router: Router;
        beforeEach( () => {
            location = TestBed.inject(Location);
            router = TestBed.inject(Router);
        });

        it('should have a active styling if activeStylingChanged from MapStylingService emits', () => {
            fixture.ngZone.run(() => {
                component.ngOnInit();
                expect(component.activeStyling).toEqual({layers: [{}]});
                mapStylingServiceMock.activeStyling = {layers: [{test: 'new'}]};
                mapStylingServiceMock.activeStylingChanged.emit();
                expect(component.activeStyling).toEqual({layers: [{test: 'new'}]});
            });
        });

        it('should call edit section if metadataChanged from MapFunctionService emits', () => {
            spyOn(component, 'editSection');
            component.ngOnInit();
            expect(component.editSection).toHaveBeenCalledTimes(1);
            mapFunctionServiceMock.metadataChanged.emit();
            expect(component.editSection).toHaveBeenCalledTimes(2);
        });

        // TODO:: inject a deep link!
        it('should set deepLink if a deepLink is present', () => {
            fixture.ngZone.run(() => {
                component.ngOnInit();

            });
        });
    });
});
