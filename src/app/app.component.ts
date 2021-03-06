import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MenuItem } from './menu/menu-item';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

/**
 * App component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    appTitle: string;
    version: string;
    @ViewChild('sidemenu') sidemenu: MatSidenav;

    constructor(public vcRef: ViewContainerRef, private router: Router) { }

    ngOnInit() {
        this.appTitle = 'VT Map Editor';
        this.version = 'v2.0.0';
    }

    /**
     * Item in sidebar menu selected
     * @param item MenuItem
     */
    onItemSelected(item: MenuItem) {
        if (item.externalLink) {
            window.open(item.link, '_blank');
        } else {
            this.router.navigate([item.link]);
        }
        this.sidemenu.close();
    }
}
