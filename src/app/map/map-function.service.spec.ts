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
});
class AppConfigServiceStub {
    exportSettings = {};
}
