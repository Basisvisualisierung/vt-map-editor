import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolShareComponent } from './tool-share.component';

describe('ToolShareComponent', () => {
    let component: ToolShareComponent;
    let fixture: ComponentFixture<ToolShareComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolShareComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolShareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});
