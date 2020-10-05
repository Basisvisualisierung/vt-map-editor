import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapStylingService } from './map-styling.service';

describe('MapStylingService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MapStylingService, HttpClientTestingModule]
        });
    });

    /*it('should be initialized', inject([MapStylingService], (service: MapStylingService) => {
        expect(service).toBeTruthy();
    }));*/

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
