import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToolBasemapComponent } from './tool-basemap.component';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from 'src/app/map/map-styling.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {MaterialDesignModule} from '../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Basemap} from '../../../shared/basemap';
import {By} from '@angular/platform-browser';
import {DOMHelper} from '../../../../testing/DOMHelper';

describe('ToolBasemapComponent', () => {
    let component: ToolBasemapComponent;
    let fixture: ComponentFixture<ToolBasemapComponent>;
    let headerServiceMock: any;
    let mapStylingServiceMock: any;
    let dh: DOMHelper<ToolBasemapComponent>;

    const basemaps: Basemap[] =  [
        {
            name: 'Farbe und mehr',
            imgUrl: 'assets/images/thumbnails/basemap_color.png',
            styling: 'assets/basemaps/style.json'
        },
        {
            name: 'Klassisch',
            imgUrl: 'assets/images/thumbnails/basemap_classic.png',
            styling: 'https://adv-smart.de/styles/public/de_style_colour_light.json'
        },
        {
            name: 'Graustufen',
            imgUrl: 'assets/images/thumbnails/basemap_grayscale.png',
            styling: '/styles/vt-style-grayscale.json'        },
        {
            name: 'Hell',
            imgUrl: 'assets/images/thumbnails/basemap_light.png',
            styling: '/styles/vt-style-light.json'
        },
        {
            name: 'Nacht',
            imgUrl: 'assets/images/thumbnails/basemap_night.png',
            styling: '/styles/vt-style-night.json'
        },
        {
            name: 'Zufall',
            imgUrl: 'assets/images/thumbnails/basemap_random.png',
            styling: '',
            randomColors: true
        }
    ];
    const activeBasemap: Basemap = {
        name: 'Zufall',
        imgUrl: 'assets/images/thumbnails/basemap_random.png',
        styling: '',
        randomColors: true
        } as Basemap;

    beforeEach(waitForAsync(() => {
        headerServiceMock = jasmine.createSpyObj('HeaderService', ['changeTitle']);
        mapStylingServiceMock = jasmine.createSpyObj('MapService', ['changeActiveBasemap', 'addBasemap', 'changeHSL']);

        return TestBed.configureTestingModule({
            declarations: [
                ToolBasemapComponent
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule
            ],
            providers: [
                {provide: MapStylingService, useValue: mapStylingServiceMock},
                {provide: HeaderService, useValue: headerServiceMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolBasemapComponent);
        component = fixture.componentInstance;
        dh = new DOMHelper(fixture);
        fixture.detectChanges();
        component.basemaps = basemaps;
        component.activeBasemap = activeBasemap;
        fixture.detectChanges();
    });

    describe('Tests depending on basemap cards', () => {

        it('should have a card for each basemap + one card for uploads', () => {
            expect(fixture.debugElement.queryAll(By.css('.basemap-card')).length).toBe(basemaps.length + 1);
        });

        it('should show a image and and name for each basemap', () => {
            const cardNames = fixture.debugElement.queryAll(By.css('.basemap-name'));
            const cardImages = fixture.debugElement.queryAll(By.css('.basemap-img'));
            for (let i = 0; i < basemaps.length; i++){
                expect(cardImages[i].nativeElement.src).toBeTruthy();
                expect(cardNames[i].nativeElement.innerHTML.trim()).toBeTruthy();
            }
        });

        it('should contain a image src and and name for each basemap from mapStylingService', () => {
            const cardNames = fixture.debugElement.queryAll(By.css('.basemap-name'));
            const cardImages = fixture.debugElement.queryAll(By.css('.basemap-img'));
            for (let i = 0; i < basemaps.length; i++){
                expect(cardImages[i].nativeElement.src).toContain(basemaps[i].imgUrl);
                expect(cardNames[i].nativeElement.innerHTML.trim()).toEqual(basemaps[i].name);
            }
        });

        it('should call changeActiveBasemap from mapStylingService once if a basemap card is clicked', () => {
            dh.clickElement('.basemap-card', basemaps[0].name);
            expect(mapStylingServiceMock.changeActiveBasemap).toHaveBeenCalledTimes(1);
        });

        it('should call changeActiveBasemap from mapStylingService with the basemap of this card', () => {
            dh.clickElement('.basemap-card', basemaps[0].name);
            expect(mapStylingServiceMock.changeActiveBasemap).toHaveBeenCalledWith(basemaps[0], false);
        });

        it('should show load basemap if upload card is clicked', () => {
            dh.clickElement('.basemap-card', 'cloud_download');
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('.load-basemap-form'))[0]).toBeTruthy();
        });

        it('should set showLoadBasemap to true onclick', () => {
            component.showLoadBasemap = false;
            fixture.detectChanges();
            dh.clickElement('.basemap-card', 'cloud_download');
            expect(component.showLoadBasemap).toBeTruthy();
        });

        it('should set showLoadBasemap to false onclick', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.clickButton('Abbrechen');
            expect(component.showLoadBasemap).toBeFalsy();
        });
    });

    describe('Tests depending on load basemap dialog', () => {

        it('should not show load basemap form before upload button is clicked', () => {
            expect(fixture.debugElement.queryAll(By.css('.load-basemap-form'))[0]).toBeUndefined();
        });

        it('should have one input field on load basemap dialog', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('input')).length).toEqual(1);
        });

        it('should have two buttons on load basemap dialog', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            expect(dh.getLength('button')).toEqual(2);
        });

        it('should have a cancel button in the load basemap dialog, which calls the toggleShowLoadBasemap method once', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            spyOn(component, 'toggleShowLoadBasemap');
            dh.clickButton('Abbrechen');
            expect(component.toggleShowLoadBasemap).toHaveBeenCalledTimes(1);
        });

        it('should have a load button in the load basemap dialog, which calls the onLoadBasemapStart method once', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            spyOn(component, 'onLoadBasemapStart');
            dh.clickButton('Laden');
            expect(component.onLoadBasemapStart).toHaveBeenCalledTimes(1);
        });

        it('should have a load button in the load basemap dialog, which calls the onLoadBasemapStart method with a id from input field',
            () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, '299696f2-0e55-4547-9943-a5efcd2f2364');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledWith('299696f2-0e55-4547-9943-a5efcd2f2364', true, false);
        });

        it('should change url to a supported format from a mapview link and call the onLoadBasemapStart method with this id', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-view/047ae30e-ef8a-468c-9903-28feb75f27b0');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledWith('047ae30e-ef8a-468c-9903-28feb75f27b0', true, false);
        });

        it('should change url to a supported format from a styling link and call the onLoadBasemapStart method with this id', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-service/style/047ae30e-ef8a-468c-9903-28feb75f27b0');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledWith('047ae30e-ef8a-468c-9903-28feb75f27b0', true, false);
        });

        it('should change url to a supported format from a editor link and call the onLoadBasemapStart method with this id', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-editor/map?id=047ae30e-ef8a-468c-9903-28feb75f27b0');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledWith('047ae30e-ef8a-468c-9903-28feb75f27b0', true, false);
        });

        it('should not call the onLoadBasemapStart method with a wrong formatted id from a editor link', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-editor/map?id=047ae30e-ef8a-468c-9903-28feb75f27b0212');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(0);
        });

        it('should not call the onLoadBasemapStart method with a wrong formatted id from a viewer link', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-view/047ae30e-ef8a-468c-9903-28feb75f27b01223');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(0);
        });

        it('should not call the onLoadBasemapStart method with a wrong formatted id from a styling link', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, 'https://bavi-dev.power-cluster-65655d4c73bf47a3300821aa2939abf4-0000.eu-de.containers.appdomain.cloud/map-view/');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(0);
        });

        it('should have a load button in the load basemap dialog, which calls the onLoadBasemapStart method once', () => {
            component.showLoadBasemap = true;
            fixture.detectChanges();
            dh.addValue('input', 0, '299696f2-0e55-4547-9943-a5efcd2f2364');
            dh.clickButton('Laden');
            expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(1);
        });
    });

    describe('Tests depending on onInit settings', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should change title onInit', () => {
            expect(headerServiceMock.changeTitle).toHaveBeenCalledTimes(1);
        });

        it('should change title to "Basiskarte"', () => {
            expect(headerServiceMock.changeTitle).toHaveBeenCalledWith('Basis<span class="accent">karte</span>');
        });

        it('should have a active basemap', () => {
            expect(component.activeBasemap).toBeTruthy();
        });

        it('should show a list of basemaps', () => {
            expect(component.basemaps.length).toBeGreaterThan(0);
        });
    });

    describe('Tests depending on control buttons', () => {

        it('should have a button to lower saturation', () => {
            spyOn(component, 'onSaturationDown');
            dh.clickAll('button');
            expect(component.onSaturationDown).toHaveBeenCalledTimes(1);
        });

        it('should have a button to increase saturation', () => {
            spyOn(component, 'onSaturationUp');
            dh.clickAll('button');
            expect(component.onSaturationUp).toHaveBeenCalledTimes(1);
        });

        it('should have a button to lower lightness', () => {
            spyOn(component, 'onLightnessDown');
            dh.clickAll('button');
            expect(component.onLightnessDown).toHaveBeenCalledTimes(1);
        });

        it('should have a button to increase lightness', () => {
            spyOn(component, 'onLightnessUp');
            dh.clickAll('button');
            expect(component.onLightnessUp).toHaveBeenCalledTimes(1);
        });

        it('should call the method Change hsl, in the map styling service with (-10, 0), if the button on saturation down is clicked',
            () => {
            component.onSaturationDown();
            expect(mapStylingServiceMock.changeHSL).toHaveBeenCalledWith(-10, 0);
        });

        it('should call the method Change hsl, in the map styling service with (10, 0), if the button on saturation up is clicked', () => {
            component.onSaturationUp();
            expect(mapStylingServiceMock.changeHSL).toHaveBeenCalledWith(10, 0);
        });

        it('should call the method Change hsl, in the map styling service with (0, -10), if the button on saturation down is clicked',
            () => {
            component.onLightnessDown();
            expect(mapStylingServiceMock.changeHSL).toHaveBeenCalledWith(0, -10);
        });

        it('should call the method Change hsl, in the map styling service with (0, 10), if the button on saturation down is clicked',
            () => {
            component.onLightnessUp();
            expect(mapStylingServiceMock.changeHSL).toHaveBeenCalledWith(0, 10);
        });

    });


});

