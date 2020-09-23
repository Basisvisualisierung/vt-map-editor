import { MenuItem } from '../menu/menu-item';
import { Basemap } from './basemap';
import { MapFunctions } from './map-functions';

/**
 * Model of setting parameters
 */
export interface SettingsModel {
    titles: {
        map: string
    };
    mapService: {
        url: string;
    };
    mapView: {
        url: string;
    };
    map: {
        maxZoom: number;
        startCenter: number[];
        startZoom: number;
        showZoomLevel: boolean;
        showScaleBar: boolean;
    };
    mapFunctions: MapFunctions;
    basemaps: Basemap[];
    menuItems: MenuItem[];
    guiLayers: {
        sortByName: boolean;
    };
}
