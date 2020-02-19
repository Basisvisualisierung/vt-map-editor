import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBasemapComponent } from './tool-basemap.component';

describe('ToolBasemapComponent', () => {
    let component: ToolBasemapComponent;
    let fixture: ComponentFixture<ToolBasemapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolBasemapComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolBasemapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
