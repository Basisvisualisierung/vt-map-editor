import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GuiLayerConfigurationComponent } from './gui-layer-configuration.component';
import {EventEmitter} from '@angular/core';
import {MapView} from '../../../../shared/mapview';
import {MapStylingService} from '../../../map-styling.service';

describe('GuiLayerConfigurationComponent', () => {
    let component: GuiLayerConfigurationComponent;
    let fixture: ComponentFixture<GuiLayerConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuiLayerConfigurationComponent],
            imports: [RouterTestingModule],
            providers: [
                { provide: MapStylingService, useClass: MapStylingServiceStub}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuiLayerConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
class MapStylingServiceStub {
    activeStyling = {layers: [{}]};
}
