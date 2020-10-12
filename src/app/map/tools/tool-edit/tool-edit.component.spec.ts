import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEditComponent } from './tool-edit.component';
import {HeaderService} from '../../../header/header.service';
import {MapStylingService} from '../../map-styling.service';

describe('ToolEditComponent', () => {
    let component: ToolEditComponent;
    let fixture: ComponentFixture<ToolEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolEditComponent],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub},
                {provide: MapStylingService, useClass: MapStylingServiceStub}
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
    activeStyling = {layers: [{}]};
}
