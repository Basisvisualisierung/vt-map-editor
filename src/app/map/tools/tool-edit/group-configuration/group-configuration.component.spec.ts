import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConfigurationComponent } from './group-configuration.component';
import {MapStylingService} from '../../../map-styling.service';

describe('GroupConfigurationComponent', () => {
    let component: GroupConfigurationComponent;
    let fixture: ComponentFixture<GroupConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupConfigurationComponent],
            providers: [
                {provide: MapStylingService, useClass: MapStylingServiceStub}
            ]
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
class MapStylingServiceStub{
    activeStyling = {layers: [{}]};
}
