import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConfigurationComponent } from './group-configuration.component';
import {MapStylingService} from '../../../map-styling.service';
import {MapFunctionService} from '../../../map-function.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialDesignModule} from '../../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('GroupConfigurationComponent', () => {
    let component: GroupConfigurationComponent;
    let fixture: ComponentFixture<GroupConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupConfigurationComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
            ],
            providers: [
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub},

            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
class MapStylingServiceStub{
    activeStyling = {layers: [{}]};
}
class MapFunctionServiceStub {}
