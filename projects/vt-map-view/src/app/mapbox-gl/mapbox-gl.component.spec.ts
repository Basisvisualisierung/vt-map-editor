import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapboxGlComponent } from './mapbox-gl.component';

describe('MapboxGlComponent', () => {
    let component: MapboxGlComponent;
    let fixture: ComponentFixture<MapboxGlComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MapboxGlComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapboxGlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
