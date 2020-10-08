import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolOverlayComponent } from './tool-overlay.component';
import {RouterTestingModule} from '@angular/router/testing';


describe('ToolOverlayComponent', () => {
    let component: ToolOverlayComponent;
    let fixture: ComponentFixture<ToolOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolOverlayComponent],
            imports: [RouterTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
