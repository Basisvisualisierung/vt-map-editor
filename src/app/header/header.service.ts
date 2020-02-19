import { EventEmitter } from '@angular/core';

/**
 * Service for changing the header title
 */
export class HeaderService {
    title: string;
    titleChanged = new EventEmitter<string>();

    constructor() { }

    /**
     * Changes the header title
     * @param title Title to be shown in the header
     * @emits HeaderService#titleChanged
     */
    changeTitle(title: string) {
        this.title = title;
        this.titleChanged.emit(this.title);
    }
}
