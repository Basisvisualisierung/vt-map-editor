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
    @ViewChild('sidemenu', { static: false }) sidemenu: MatSidenav;

    constructor(public vcRef: ViewContainerRef, private router: Router) { }

    ngOnInit() {
        this.appTitle = 'VT Map Editor';
        this.version = 'v0.6.1';
    }

    /**
     * Item in sidebar menu selected
     * @param item MenuItem
     */
    onItemSelected(item: MenuItem) {
        this.router.navigate([item.link]);
        this.sidemenu.close();
    }
}
