import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

    beforeEach(async(() => {
        headerServiceMock = jasmine.createSpyObj('HeaderService', ['changeTitle']);
        mapStylingServiceMock = jasmine.createSpyObj('MapService', ['changeActiveBasemap', 'addBasemap']);

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

    it('should not show load basemap form before upload button is clicked', () => {
        expect(fixture.debugElement.queryAll(By.css('.load-basemap-form'))[0]).toBeUndefined();
    });

    it('should show load basemap if upload button is clicked', () => {
        dh.clickElement('.basemap-card', 'cloud_download');
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('.load-basemap-form'))[0]).toBeTruthy();
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

    it('should have a load button in the load basemap dialog, which calls the onLoadBasemapStart method with a id from input field', () => {
        component.showLoadBasemap = true;
        fixture.detectChanges();
        dh.addValue('input', 0, '299696f2-0e55-4547-9943-a5efcd2f2364');
        dh.clickButton('Laden');
        expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledWith('299696f2-0e55-4547-9943-a5efcd2f2364', true, false);
    });

    it('should have a load button in the load basemap dialog, which calls the onLoadBasemapStart method with a id from input field', () => {
        component.showLoadBasemap = true;
        fixture.detectChanges();
        dh.addValue('input', 0, '299696f2-0e55-4547-9943-a5efcd2f2364');
        dh.clickButton('Laden');
        expect(mapStylingServiceMock.addBasemap).toHaveBeenCalledTimes(1);
    });

    it('should call changeActiveBasemap from mapStylingService once if a basemap card is clicked', () => {
        dh.clickElement('.basemap-card', basemaps[0].name);
        expect(mapStylingServiceMock.changeActiveBasemap).toHaveBeenCalledTimes(1);
    });

    it('should call changeActiveBasemap from mapStylingService with the basemap of this card', () => {
        dh.clickElement('.basemap-card', basemaps[0].name);
        expect(mapStylingServiceMock.changeActiveBasemap).toHaveBeenCalledWith(basemaps[0], false);
    });
});

