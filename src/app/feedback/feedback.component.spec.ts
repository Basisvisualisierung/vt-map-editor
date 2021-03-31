import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import {HeaderService} from '../header/header.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FeedbackComponent', () => {
    let component: FeedbackComponent;
    let fixture: ComponentFixture<FeedbackComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            declarations: [
                FeedbackComponent
            ],
            providers: [
                { provide: HeaderService, useClass: HeaderServiceStub }
                ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class HeaderServiceStub{
    changeTitle(title: string) {}
}
