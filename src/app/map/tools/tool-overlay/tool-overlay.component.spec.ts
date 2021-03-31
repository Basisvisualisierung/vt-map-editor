import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResizableModule } from 'angular-resizable-element';
import { ToolOverlayComponent } from './tool-overlay.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialDesignModule} from '../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('ToolOverlayComponent', () => {
    let component: ToolOverlayComponent;
    let fixture: ComponentFixture<ToolOverlayComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ToolOverlayComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ResizableModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
