import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolEditComponent } from './tool-edit.component';

describe('ToolEditComponent', () => {
    let component: ToolEditComponent;
    let fixture: ComponentFixture<ToolEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});
