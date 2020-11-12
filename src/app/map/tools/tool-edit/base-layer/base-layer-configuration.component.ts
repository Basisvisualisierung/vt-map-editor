import { Component, OnInit } from '@angular/core';
import {MapStylingService} from '../../../map-styling.service';

@Component({
  selector: 'app-base-layer',
  templateUrl: './base-layer-configuration.component.html',
  styleUrls: ['./base-layer-configuration.component.scss']
})
export class BaseLayerConfigurationComponent implements OnInit {
    activeStyling: any;
    constructor(private mapStylingService: MapStylingService) { }

  ngOnInit(): void {
        this.activeStyling = this.mapStylingService.activeStyling;
  }

}
