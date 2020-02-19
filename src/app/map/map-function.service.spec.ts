import { TestBed } from '@angular/core/testing';

import { MapFunctionService } from './map-function.service';

describe('MapFunctionService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MapFunctionService = TestBed.get(MapFunctionService);
        expect(service).toBeTruthy();
    });
});
