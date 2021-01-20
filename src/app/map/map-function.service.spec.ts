import { TestBed } from '@angular/core/testing';

import { MapFunctionService } from './map-function.service';
import {AppConfigService} from '../app-config.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MapFunctionService', () => {
    let mapFunctionService: MapFunctionService;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            MapFunctionService,
            {provide: AppConfigService, useClass: AppConfigServiceStub}
        ]
    }));

    it('should be created', () => {
        mapFunctionService = TestBed.inject(MapFunctionService);
        expect(mapFunctionService).toBeTruthy();
    });

    describe('toggleMapFunction', () => {
        beforeEach(() => {
            mapFunctionService = TestBed.inject(MapFunctionService);
            spyOn(mapFunctionService.mapFunctionsChanged, 'emit');
            mapFunctionService.toggleMapFunction('search', true);
        });

        it('should emit if called', () => {
            expect(mapFunctionService.mapFunctionsChanged.emit).toHaveBeenCalledTimes(1);
        });

        it('should emit function name', () => {
            expect(mapFunctionService.mapFunctionsChanged.emit).toHaveBeenCalledWith('search');
        });

        it('should have a enabled value for this map function that is true', () => {
            expect(mapFunctionService.mapFunctions.search.enabled).toBeTruthy();
        });

        it('should have a enabled value for this map function that is false, if called with enabled = false', () => {
            mapFunctionService.toggleMapFunction('search', false);
            expect(mapFunctionService.mapFunctions.search.enabled).toBeFalsy();
        });
    });

    describe('setFunctionConfiguration', () => {
        beforeEach(() => {
            mapFunctionService = TestBed.inject(MapFunctionService);
            spyOn(mapFunctionService.mapFunctionsChanged, 'emit');
            mapFunctionService.setFunctionConfiguration('search', 'test');
        });

        it('should emit if called', () => {
            expect(mapFunctionService.mapFunctionsChanged.emit).toHaveBeenCalledTimes(1);
        });

        it('should emit function name', () => {
            expect(mapFunctionService.mapFunctionsChanged.emit).toHaveBeenCalledWith('search');
        });

        it('should have a configuration value after called', () => {
            expect(mapFunctionService.mapFunctions.search.configuration).toBeTruthy();
        });

        it('should have "Test" configuration value after called', () => {
            expect(mapFunctionService.mapFunctions.search.configuration).toEqual('test');
        });
    });

});
class AppConfigServiceStub {
    settings = {
        mapFunctions: {
            navigation: {
                show: true,
                enabled: true
            },
            info: {
                show: true,
                enabled: true
            },
            search: {
                show: true,
                enabled: true
            }
        },
    };
}
