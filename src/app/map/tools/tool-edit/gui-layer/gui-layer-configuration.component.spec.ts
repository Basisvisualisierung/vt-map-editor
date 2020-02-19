import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiLayerConfigurationComponent } from './gui-layer-configuration.component';

describe('GuiLayerConfigurationComponent', () => {
    let component: GuiLayerConfigurationComponent;
    let fixture: ComponentFixture<GuiLayerConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuiLayerConfigurationComponent]
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
