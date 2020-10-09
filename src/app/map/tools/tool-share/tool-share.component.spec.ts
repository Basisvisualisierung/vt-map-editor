import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolShareComponent } from './tool-share.component';
import {HeaderService} from '../../../header/header.service';
import {MapStylingService} from '../../map-styling.service';
import {MapFunctionService} from '../../map-function.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfigService} from '../../../app-config.service';

describe('ToolShareComponent', () => {
    let component: ToolShareComponent;
    let fixture: ComponentFixture<ToolShareComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolShareComponent],
            imports: [HttpClientTestingModule],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub},
                {provide: MatSnackBar, useValue: {}},
                {provide: AppConfigService, useClass: AppConfigServiceStub}
                ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolShareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class HeaderServiceStub{
    changeTitle(){}
}
class MapStylingServiceStub{}
class MapFunctionServiceStub{
}
class AppConfigServiceStub{
    settings = {
        mapService: {
            url: {}
        }
    };
}
