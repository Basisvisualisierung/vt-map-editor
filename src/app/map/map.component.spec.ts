import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

    beforeEach(async(() => {
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
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: AppConfigService, useClass: AppConfigServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        dh = new DOMHelper(fixture);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should navigate to / before click on toolbar-btn',
        () => {
        const location = TestBed.inject(Location);
        expect(location.path()).toBe('');
    });

    it('Should navigate to /map/basemap on toolbar-btn[0] click', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');
        dh.clickButton('map');
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/basemap']), { skipLocationChange: false });

    });

    it('Should navigate to /map/edit on toolbar-btn[1] click', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');
        dh.clickButton('layers');
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/edit']), { skipLocationChange: false });
    });

    it('Should navigate to /map/functions on toolbar-btn[2] click', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');
        dh.clickButton('settings');
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/functions']), { skipLocationChange: false });
    });

    it('Should navigate to /map/share on toolbar-btn[3] click', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigateByUrl');
        dh.clickButton('share');
        expect(router.navigateByUrl).toHaveBeenCalledWith(router.createUrlTree(['/map/share']), { skipLocationChange: false });
    });

    it('Should show a toolbar onload', () => {
        expect(fixture.debugElement.queryAll(By.css('.toolbar')).length).toBe(1);
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

    it('Should show overlay after button click', () => {
        dh.clickButton('share');
        expect(dh.getLength('.overlayContainer')).toBe(1);

    });

    it('Should not show overlay on load', () => {
        expect(dh.getLength('.overlayContainer')).toBe(0);
    });

    it('Should show overlay if showToolOverlay is true', () => {
        component.showToolOverlay = true;
        fixture.detectChanges();
        expect(dh.getLength('.overlayContainer')).toBe(1);
    });

    it('Should hide overlay if showToolOverlay is false', () => {
        component.showToolOverlay = false;
        expect(dh.getLength('.overlayContainer')).toBe(0);
    });
});

class HeaderServiceStub{
    titleChanged = new EventEmitter<string>();
    changeTitle(title: string) {
        this.titleChanged.emit('');
    }
}
class MapStylingServiceStub{
    activeStylingChanged = new EventEmitter<string>();
    activeBasemapChanged = new EventEmitter<MapView>();
}

class MapFunctionServiceStub{
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
