import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConfigurationComponent } from './group-configuration.component';

describe('GroupConfigurationComponent', () => {
    let component: GroupConfigurationComponent;
    let fixture: ComponentFixture<GroupConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupConfigurationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
