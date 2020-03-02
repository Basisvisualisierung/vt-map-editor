import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MapStylingService } from '../../map-styling.service';

/**
 * Configuration tools for a layer
 */
@Component({
    selector: 'app-layer-configuration',
    templateUrl: './layer-configuration.component.html',
    styleUrls: ['./layer-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayerConfigurationComponent implements OnInit {
    @Input() layer;
    layerVisible: boolean;
    color: string;
    opacity: number;
    showColorPicker: boolean;

    constructor(private mapStylingService: MapStylingService) { }

    ngOnInit() {
        this.layerVisible = true;
        this.opacity = 1;
        this.showColorPicker = false;

        // Read color and opacity from styling
        const colorAttribute = this.layer.type + '-color';
        const opacityAttribute = this.layer.type + '-opacity';
        if (this.layer.paint !== undefined) {
            if (this.layer.paint[colorAttribute] !== undefined) {
                this.color = this.layer.paint[colorAttribute];
            } else {
                this.color = '#000000';
            }

            if (this.layer.paint[opacityAttribute] !== undefined) {
                this.opacity = this.layer.paint[opacityAttribute];
            }
        }

        // Apply visibility
        if (this.layer.layout !== undefined && this.layer.layout.visibility !== undefined) {
            this.layerVisible = this.layer.layout.visibility === 'none' ? false : true;
        }
    }

    /**
     * Change visibility
     */
    onVisibilityChanged() {
        this.layerVisible = !this.layerVisible;
        this.mapStylingService.changeLayerVisibility(this.layer.id, this.layerVisible);
    }

    /**
     * Show color picker
     */
    onOpenColorPicker() {
        this.showColorPicker = true;
    }

    /**
     * Change fill color
     * @param color Color (hex, rgb, rgba, hsl, hsla)
     */
    onColorChanged(color: string) {
        this.color = color;
        const colorType = (this.layer.type === 'symbol') ? 'text' : this.layer.type;
        this.mapStylingService.changeLayerAttribute(this.layer.id, 'paint.' + colorType + '-color', color);
    }

    /**
     * Change Opacity
     * @param event Slider event
     */
    onOpacityChanged(event: any) {
        this.opacity = event.value;
        const attributeName = 'paint.' + this.layer.type + '-opacity';
        this.mapStylingService.changeLayerAttribute(this.layer.id, attributeName, this.opacity);
    }
}
