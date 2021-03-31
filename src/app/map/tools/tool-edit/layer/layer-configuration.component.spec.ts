import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LayerConfigurationComponent } from './layer-configuration.component';
import {MapStylingService} from '../../../map-styling.service';
import {MaterialDesignModule} from '../../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayerElementComponent} from './layer-element.component';

describe('LayerConfigurationComponent', () => {
    let component: LayerConfigurationComponent;
    let fixture: ComponentFixture<LayerConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialDesignModule,
                BrowserAnimationsModule,
            ],
            declarations: [
                LayerConfigurationComponent,
                LayerElementComponent
            ],
            providers: [
                {provide: MapStylingService, useClass: MapStylingServiceStub}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayerConfigurationComponent);
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
