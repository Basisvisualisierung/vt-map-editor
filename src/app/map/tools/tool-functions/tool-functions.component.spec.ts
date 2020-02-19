import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolFunctionsComponent } from './tool-functions.component';

describe('ToolFunctionsComponent', () => {
    let component: ToolFunctionsComponent;
    let fixture: ComponentFixture<ToolFunctionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolFunctionsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolFunctionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
