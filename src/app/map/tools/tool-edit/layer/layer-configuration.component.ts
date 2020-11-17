import { Component, OnInit } from '@angular/core';
import {MapStylingService} from '../../../map-styling.service';

@Component({
  selector: 'app-layer-configuration',
  templateUrl: './layer-configuration.component.html',
  styleUrls: ['./layer-configuration.component.scss']
})
export class LayerConfigurationComponent implements OnInit {
    activeStyling: any;
    constructor(private mapStylingService: MapStylingService) { }

  ngOnInit(): void {
        this.activeStyling = this.mapStylingService.activeStyling;
  }

}
