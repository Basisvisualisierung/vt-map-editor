import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConfigService } from '../app-config.service';
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

    menuItems: MenuItem[];

    constructor() {
        // Read menu items definitions from configuration
        if (AppConfigService.settings.menuItems !== undefined) {
            this.menuItems = AppConfigService.settings.menuItems;
        }
    }

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
