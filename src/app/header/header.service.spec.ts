import { TestBed } from '@angular/core/testing';

import { HeaderService } from './header.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppConfigService} from '../app-config.service';


describe('HeaderService', () => {
    let headerService: HeaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HeaderService,
                {provide: AppConfigService, useClass: AppConfigServiceStub},
            ]
        });
    });

    it('should be created', () => {
        headerService = TestBed.inject(HeaderService);
        expect(headerService).toBeTruthy();
    });
});
class AppConfigServiceStub{}
