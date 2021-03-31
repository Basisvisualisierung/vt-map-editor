import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuItem } from './menu-item';
import { MenuComponent } from './menu.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppConfigService} from '../app-config.service';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MenuComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                {provide: AppConfigService, useClass: AppConfigServiceStub}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
class AppConfigServiceStub{
    settings = {menuItems: [
            {
                label: 'Map',
                icon: 'map',
                link: 'map',
                externalLink: false
            },
            {
                label: 'Privacy',
                icon: 'lock',
                link: 'privacy',
                externalLink: false
            },
            {
                label: 'Legals',
                icon: 'comment',
                link: 'https://...',
                externalLink: true
            }
        ],

    };
}
