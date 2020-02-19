import { MapFunctions } from 'src/app/shared/map-functions';
import { Basemap } from 'src/app/shared/basemap';

/**
 * Model of setting parameters
 */
export interface SettingsModel {
    mapService: {
        url: string;
    };
    searchService: {
        searchApi: string,
        searchApiKey: string,
        routingApiKey: string
    };
}
