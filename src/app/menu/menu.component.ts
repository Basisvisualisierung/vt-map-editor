import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from './menu-item';

/**
 * Sidebar menu
 */
@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    @Input() title: string;
    @Input() version: string;
    @Output() itemSelected = new EventEmitter<MenuItem>();

    menuItems: MenuItem[] = [
        new MenuItem(
            'Karte',
            'map',
            'map'
        ),
        new MenuItem(
            'Datenschutz',
            'lock',
            'privacy'
        ),
        new MenuItem(
            'Impressum',
            'comment',
            'legals'
        )
    ];

    constructor() { }

    ngOnInit() { }

    /**
     * Select menu item
     * @param item selected MenuItem
     * @emit MenuComponent#itemSelected
     */
    onItemSelected(item: MenuItem) {
        this.itemSelected.emit(item);
    }
}
