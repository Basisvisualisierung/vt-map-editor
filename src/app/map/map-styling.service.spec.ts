import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapStylingService } from './map-styling.service';
import {ActivatedRoute} from '@angular/router';
import {AppConfigService} from '../app-config.service';

describe('MapStylingService', () => {
    let mapStylingService: MapStylingService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MapStylingService,
                {provide: AppConfigService, useClass: AppConfigServiceStub},
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get(): string {
                                    return '123';
                                },
                            },
                        },
                    },
                },
            ]
        });
    });

    it('should be created', () => {
        mapStylingService = TestBed.inject(MapStylingService);
        expect(mapStylingService ).toBeTruthy();
    });

    /*it('should set initial activeStyling', fakeAsync(inject(
        [MapStylingService, HttpTestingController],
        (service: MapStylingService, backend: HttpTestingController) => {
            service.activeStylingChanged.subscribe(
                (styling) => {
                    expect(service.activeStyling).toEqual(styling);
                }
            );

            backend
                .expectOne({
                    url: 'assets/teststyle.json'
                })
                .flush({
                    layers: [
                        {
                            id: 'Hintergrund',
                            type: 'background',
                            layout: {
                                visibility: 'visible'
                            },
                            paint: {
                                'background-color': 'rgba(255, 255, 230, 1)'
                            }
                        }
                    ]
                });
        }
    )));*/
});
class AppConfigServiceStub{
    settings = {
        map: {},
        basemaps: [{}]
    };
}
