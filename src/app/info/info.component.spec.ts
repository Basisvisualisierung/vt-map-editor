import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoComponent } from './info.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HeaderService} from '../header/header.service';
import {MenuComponent} from '../menu/menu.component';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



describe('InfoComponent', () => {
    let component: InfoComponent;
    let fixture: ComponentFixture<InfoComponent>;
    let activatedRoute: ActivatedRouteStub;

    beforeEach(waitForAsync(() => {
        activatedRoute = new ActivatedRouteStub({snapshot: {params: {myId: '123'}}});
        TestBed.configureTestingModule({
            declarations: [InfoComponent, MenuComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: ActivatedRoute, useValue: {snapshot: {url: '123'}}},
                HeaderService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
