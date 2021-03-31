import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import {MapboxGlComponent} from './map/mapbox-gl/mapbox-gl.component';
import {MaterialDesignModule} from './material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {MenuComponent} from './menu/menu.component';
import {AppConfigService} from './app-config.service';
import {HeaderService} from './header/header.service';
import {EventEmitter} from '@angular/core';

describe('AppComponent', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule,
            ],
            declarations: [
                AppComponent,
                MapboxGlComponent,
                HeaderComponent,
                MenuComponent
            ],
            providers: [
                {provide: AppConfigService, useClass: AppConfigServiceStub},
                {provide: HeaderService, useClass: HeaderServiceStub}
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'VT Map Editor'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const app = fixture.debugElement.componentInstance;
        expect(app.appTitle).toEqual('VT Map Editor');
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

class HeaderServiceStub{
    titleChanged = new EventEmitter<string>();
    changeTitle(title: string) {
        this.titleChanged.emit('');
    }
}
