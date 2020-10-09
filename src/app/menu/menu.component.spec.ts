import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItem } from './menu-item';
import { MenuComponent } from './menu.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppConfigService} from '../app-config.service';

describe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuComponent],
            imports: [HttpClientTestingModule],
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
