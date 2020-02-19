import { Injectable, EventEmitter } from '@angular/core';
import { MapFunction } from '../shared/map-function';
import { MapFunctions } from '../shared/map-functions';
import { AppConfigService } from '../app-config.service';

/**
 * Service to manage the map functions
 */
@Injectable()
export class MapFunctionService {
    mapFunctions: MapFunctions;
    mapFunctionsChanged = new EventEmitter<string>();

    constructor() {
        this.mapFunctions = AppConfigService.settings.mapFunctions;
    }

    /**
     * (De-)activates a map function
     * @param functionName Name of the map function
     * @param enable true: activate; false: deactivate
     */
    toggleMapFunction(functionName: string, enable) {
        this.mapFunctions[functionName].enabled = enable;
        this.mapFunctionsChanged.emit(functionName);
    }

    /**
     * Set the configuration for a map function
     * @param functionName Name of the map function
     * @param config configuration object
     */
    setFunctionConfiguration(functionName: string, config: any) {
        this.mapFunctions[functionName].configuration = config;
        this.mapFunctionsChanged.emit(functionName);
    }
}
