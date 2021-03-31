import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ToolShareComponent } from './tool-share.component';
import {HeaderService} from '../../../header/header.service';
import {MapStylingService} from '../../map-styling.service';
import {MapFunctionService} from '../../map-function.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppConfigService} from '../../../app-config.service';
import {EventEmitter} from '@angular/core';
import {MaterialDesignModule} from '../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ClipboardModule} from 'ngx-clipboard';
import {Location} from '@angular/common';

describe('ToolShareComponent', () => {
    let component: ToolShareComponent;
    let fixture: ComponentFixture<ToolShareComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ToolShareComponent],
            imports: [
                HttpClientTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                ClipboardModule
            ],
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
class MapStylingServiceStub{
    activeStylingChanged = new EventEmitter<string>();
}
class MapFunctionServiceStub{}
class AppConfigServiceStub{
    settings = {
        mapService: {
            url: {}
        }
    };
}
