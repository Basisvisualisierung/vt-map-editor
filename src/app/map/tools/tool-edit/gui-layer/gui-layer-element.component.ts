import {Component, OnInit, ChangeDetectorRef, Input, ViewEncapsulation} from '@angular/core';
import { MapStylingService } from 'src/app/map/map-styling.service';

/**
 * Element of a GUI layer (e.g. fill, outline)
 */
@Component({
    selector: 'app-gui-layer-element',
    templateUrl: './gui-layer-element.component.html',
    styleUrls: ['./gui-layer-element.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GuiLayerElementComponent implements OnInit{
    @Input() guiLayerName: string;
    @Input() elementName: string;
    @Input() layer: any;
    color: string;
    showColorPicker: boolean;

    constructor(private mapStylingService: MapStylingService, private cdr: ChangeDetectorRef) { }
    ngOnInit() {
        this.showColorPicker = false;
        // Read paint attributes from styling
        const colorType = (this.layer.type === 'symbol') ? 'text' : this.layer.type;
        const colorAttribute = colorType + '-color';
        const opacityAttribute = colorType + '-opacity';
        if (this.layer.paint !== undefined) {
            // tslint:disable-next-line:max-line-length
            if (this.layer.paint[colorAttribute]  !== undefined && this.layer.paint[opacityAttribute] !== undefined && typeof this.layer.paint[opacityAttribute] !== 'object') {
                // tslint:disable-next-line:max-line-length
                this.color = this.mapStylingService.changeColorToSupported(this.layer.paint[colorAttribute], this.layer.paint[opacityAttribute]);
            } else if (this.layer.paint[colorAttribute] !== undefined ) {
                this.color = this.mapStylingService.changeColorToSupported(this.layer.paint[colorAttribute]);
            } else {
                this.color = '#000000';
            }
        }
    }

    /**
     * Change color
     * @param color Color (hex, rgb, rgba, hsl, hsla)
     */
    onColorChanged(color: string) {
        this.color = color;
        this.mapStylingService.changeGuiLayerColor(this.guiLayerName, this.elementName, color);
        this.cdr.detectChanges();
    }

    /**
     * Change visibility of colorPicker
     */
    changeVisibility(){
        this.showColorPicker = !this.showColorPicker;
        this.cdr.detectChanges();
    }
}
