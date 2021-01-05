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


describe('ToolEditComponent', () => {
    let component: ToolEditComponent;
    let fixture: ComponentFixture<ToolEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ToolEditComponent,
                LayerConfigurationComponent,
                LayerElementComponent
            ],
            imports: [
                RouterTestingModule.withRoutes(
                    [{path: 'map/edit/layer', component: LayerConfigurationComponent}]
                ),
                MaterialDesignModule,
                BrowserAnimationsModule,
            ],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
class HeaderServiceStub{
    changeTitle(title: string) {}
}
class MapStylingServiceStub{
    activeStylingChanged = new EventEmitter<string>();
    activeStyling = {layers: [{}]};
}
class MapFunctionServiceStub{
    metadataChanged = new EventEmitter<any>();
}
