import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolOverlayComponent } from './tool-overlay.component';

describe('ToolOverlayComponent', () => {
    let component: ToolOverlayComponent;
    let fixture: ComponentFixture<ToolOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolOverlayComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});
