import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import {HeaderService} from './header.service';
import {RouterTestingModule} from '@angular/router/testing';
import {EventEmitter} from '@angular/core';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let headerService: HeaderServiceStub;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: HeaderService, useClass: HeaderServiceStub}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain a header-title tag', () => {
        expect(fixture.debugElement.query(By.css('.header-title'))).toBeTruthy();
    });

    it('should have a header title', () => {
        component.title = 'Test Title';
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.header-title')).nativeElement.textContent).toBe('Test Title');
    });

    it('should render a title emitted by headerService', fakeAsync(() => {
        headerService = TestBed.inject(HeaderService) as HeaderServiceStub;
        headerService.titleChanged.emit('a title from headerService');
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.header-title')).nativeElement.textContent).toBe('a title from headerService');
    }));

    it('should have a button of class menu-btn', () => {
        expect(fixture.debugElement.query(By.css('.menu-btn'))).toBeTruthy();
    });

    it('should emit toggleMenu on menu-btn click', () => {
        spyOn(component.toggleMenu, 'emit');
        const button = fixture.nativeElement.querySelector('.menu-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.toggleMenu.emit).toHaveBeenCalledTimes(1);
    });
});

class HeaderServiceStub{
    titleChanged = new EventEmitter<string>();
    changeTitle(title: string) {
        this.titleChanged.emit(title);
    }
}

