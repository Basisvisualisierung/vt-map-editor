import {Injectable, EventEmitter, OnInit} from '@angular/core';
import { MapFunctions } from '../shared/map-functions';
import { AppConfigService } from '../app-config.service';

/**
 * Service to manage the map functions
 */
@Injectable()
export class MapFunctionService {
    mapFunctions: MapFunctions;
    mapFunctionsChanged = new EventEmitter<string>();
    metadataChanged = new EventEmitter<any>();
    // tslint:disable-next-line:variable-name
    private _guiLayerState: boolean;
    // tslint:disable-next-line:variable-name
    private _groupLayerState: boolean;

    set guiLayerState(state: boolean){
        this._guiLayerState = state;
    }
    get guiLayerState(): boolean {
        return this._guiLayerState;
    }

    set groupLayerState(state: boolean){
        this._groupLayerState = state;
    }

    get groupLayerState(): boolean {
        return this._groupLayerState;
    }

    constructor(private appConfigService: AppConfigService) {
        this.mapFunctions = appConfigService.settings.mapFunctions;
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
