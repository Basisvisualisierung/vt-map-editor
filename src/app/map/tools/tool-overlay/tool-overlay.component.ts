import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input, AfterViewInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { Router } from '@angular/router';

/**
 * Overlay view for map tools.
 */
@Component({
    selector: 'app-tool-overlay',
    templateUrl: './tool-overlay.component.html',
    styleUrls: ['./tool-overlay.component.scss']
})
export class ToolOverlayComponent implements OnInit, AfterViewInit {
    @Input() overlayHeight: number;
    @Input() overlayMinHeight: number;

    @Output() overlayClosed = new EventEmitter<void>();
    @Output() overlayResized = new EventEmitter<number>();

    @ViewChild('toolOverlay') overlay: ElementRef;

    constructor(private router: Router) { }

    ngOnInit() { }

    ngAfterViewInit() {
        // Adjust height of the overlay after component is initialized.
        this.overlay.nativeElement.style.height = this.overlayHeight + 'px';
    }

    /**
     * Overlay height changed
     * Height must not be less than overlayMinHeight. Height will be set to overlayMinHeight if larger.
     * The maximum height ist defined by max-height attribute in CSS
     * @param event ResizeEvent
     */
    onResizeEnd(event: ResizeEvent): void {
        if (event.rectangle.height <= 10) {
            // Close overlay when swiped to the bottom of the screen
            this.onCloseOverlay();
            this.overlayHeight = this.overlayMinHeight;
        } else {
            // Change overlay height
            this.overlayHeight = (event.rectangle.height < this.overlayMinHeight) ? this.overlayMinHeight : event.rectangle.height;
            this.overlayResized.emit(this.overlayHeight);
            this.overlay.nativeElement.style.height = this.overlayHeight + 'px';
        }
    }

    /**
     * Close overlay
     */
    onCloseOverlay() {
        this.overlayClosed.emit();
    }

    /**
     * Checks the URL, if overlay should be closed
     * This function is needed to close the overlay if the user clicks the "back" button of the browser
     * and navigates back to component "/map"
     */
    checkOverlayState() {
        if (this.router.url.search(/\/map$/) > -1) {
            this.onCloseOverlay();
        }
    }
}
