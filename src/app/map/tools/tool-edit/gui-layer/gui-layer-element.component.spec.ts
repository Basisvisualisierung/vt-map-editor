import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiLayerElementComponent } from './gui-layer-element.component';
import {MapStylingService} from '../../../map-styling.service';
import {ColorPickerModule} from 'ngx-color-picker';

describe('GuiLayerElementComponent', () => {
    let component: GuiLayerElementComponent;
    let fixture: ComponentFixture<GuiLayerElementComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GuiLayerElementComponent,
            ],
            imports: [
                ColorPickerModule
            ],
            providers: [{provide: MapStylingService, useClass: MapStylingServiceStub}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuiLayerElementComponent);
        component = fixture.componentInstance;
        const layer = {type: {}};
        component.layer = layer;
        fixture.detectChanges();

    });

    it('should create', () => {
        const layer = {type: {}};
        component.layer = layer;
        expect(component).toBeTruthy();
    });
});
class MapStylingServiceStub{
    activeStyling = {layers: [{}]};
}
