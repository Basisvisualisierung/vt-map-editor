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
    searchService: {
        searchApi: string,
        searchApiKey: string
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
    guiLayers: {
        sortByName: boolean;
    };
}
