import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolBasemapComponent } from './tool-basemap.component';
import { HeaderService } from 'src/app/header/header.service';
import { MapStylingService } from 'src/app/map/map-styling.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ToolBasemapComponent', () => {
    let component: ToolBasemapComponent;
    let fixture: ComponentFixture<ToolBasemapComponent>;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            declarations: [
                ToolBasemapComponent
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule
            ],
            providers: [
                {provide: MapStylingService, useClass: MapStylingServiceStub},
                {provide: HeaderService, useClass: HeaderServiceStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolBasemapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /*it('should create', () => {
        expect(component).toBeTruthy();
    });*/
});
class MapStylingServiceStub {

}
class HeaderServiceStub {
    changeTitle(title: string) {}
}
