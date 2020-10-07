import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderService} from '../header/header.service';
import {MapStylingService} from './map-styling.service';
import {EventEmitter} from '@angular/core';
import {AppConfigService} from '../app-config.service';


describe('MapComponent', () => {
    let component: MapComponent;
    let fixture: ComponentFixture<MapComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MapComponent
            ],
            imports: [
                RouterTestingModule
            ],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: AppConfigService, useValue: {exportSettings: {titles: {text: 'test'}}}}

            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class HeaderServiceStub{
    titleChanged = new EventEmitter<string>();
    changeTitle(title: string) {
        this.titleChanged.emit('');
    }
}
class MapStylingServiceStub{}

