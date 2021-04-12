import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MaplibreGlComponent } from './maplibre-gl.component';

describe('MaplibreGlComponent', () => {
    let component: MaplibreGlComponent;
    let fixture: ComponentFixture<MaplibreGlComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MaplibreGlComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MaplibreGlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
