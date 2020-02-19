import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MapStylingService } from 'src/app/map/map-styling.service';

/**
 * Element of a GUI layer (e.g. fill, outline)
 */
@Component({
    selector: 'app-gui-layer-element',
    templateUrl: './gui-layer-element.component.html',
    styleUrls: ['./gui-layer-element.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GuiLayerElementComponent implements OnInit {
    @Input() guiLayerName: string;
    @Input() elementName: string;
    @Input() layer: any;
    color: string;
    showColorPicker: boolean;

    constructor(private mapStylingService: MapStylingService) { }

    ngOnInit() {
        this.showColorPicker = false;

        // Read paint attributes from styling
        const colorType = (this.layer.type === 'symbol') ? 'text' : this.layer.type;
        const colorAttribute = colorType + '-color';
        if (this.layer.paint !== undefined) {
            if (this.layer.paint[colorAttribute] !== undefined) {
                this.color = this.layer.paint[colorAttribute];
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
        const colorType = (this.layer.type === 'symbol') ? 'text' : this.layer.type;
        this.mapStylingService.changeGuiLayerColor(this.guiLayerName, this.elementName, color);
    }
}
