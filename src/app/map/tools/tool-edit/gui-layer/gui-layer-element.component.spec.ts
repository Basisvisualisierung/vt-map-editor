import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiLayerElementComponent } from './gui-layer-element.component';

describe('GuiLayerElementComponent', () => {
    let component: GuiLayerElementComponent;
    let fixture: ComponentFixture<GuiLayerElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GuiLayerElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuiLayerElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
