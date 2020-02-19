import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderService } from './header.service';

/**
 * App header
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() toggleMenu = new EventEmitter<void>();
    title: string;

    constructor(private headerService: HeaderService) {
        this.headerService.titleChanged.subscribe(
            (title) => {
                this.title = title;
            }
        );
    }

    ngOnInit() {
    }

    /**
     * Menu button clicked
     * @emits HeaderComponent#toggleMenu
     */
    onMenuClicked() {
        this.toggleMenu.emit();
    }
}
