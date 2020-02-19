import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapboxGlComponent } from './mapbox-gl.component';

describe('MapboxGlComponent', () => {
    let component: MapboxGlComponent;
    let fixture: ComponentFixture<MapboxGlComponent>;

    beforeEach(async(() => {
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
