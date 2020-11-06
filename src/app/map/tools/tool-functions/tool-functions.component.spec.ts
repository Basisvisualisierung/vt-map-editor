import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFunctionsComponent } from './tool-functions.component';
import {HeaderService} from '../../../header/header.service';
import {MapFunctionService} from '../../map-function.service';

describe('ToolFunctionsComponent', () => {
    let component: ToolFunctionsComponent;
    let fixture: ComponentFixture<ToolFunctionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolFunctionsComponent],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapFunctionService, useClass: MapFunctionServiceStub}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolFunctionsComponent);
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

class MapFunctionServiceStub{
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
