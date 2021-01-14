import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GuiLayerConfigurationComponent } from './gui-layer-configuration.component';
import {MapStylingService} from '../../../map-styling.service';
import {MaterialDesignModule} from '../../../../material-design/material-design.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('GuiLayerConfigurationComponent', () => {
    let component: GuiLayerConfigurationComponent;
    let fixture: ComponentFixture<GuiLayerConfigurationComponent>;
    let mapStylingServiceMock: any;

    beforeEach(async(() => {
        mapStylingServiceMock = jasmine.createSpyObj('MapStylingService', ['changeGuiLayerVisibility']);
        mapStylingServiceMock.guiLayerSettings = [];

        TestBed.configureTestingModule({
            declarations: [GuiLayerConfigurationComponent],
            imports: [
                RouterTestingModule,
                MaterialDesignModule,
                BrowserAnimationsModule
            ],
            providers: [
                { provide: MapStylingService, useValue: mapStylingServiceMock}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GuiLayerConfigurationComponent);
        component = fixture.componentInstance;
        mapStylingServiceMock.guiLayerSettings = { Meer: { visible: true }};
        mapStylingServiceMock.activeStyling = {
            layers: [
                {
                    id: 'Meer',
                    type: 'fill',
                    metadata: {
                        'map-editor:group': 'Gewässer',
                        'map-editor:layer': 'Meer',
                        'map-editor:layer-element': 'Füllung'
                    },
                }
            ]
        };
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should call parseMetadata onInit', () => {
       spyOn(component, 'parseMetadata');
       component.ngOnInit();
       expect(component.parseMetadata).toHaveBeenCalledTimes(1);
    });

    describe('Tests related to parseMetadata()', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should call sortGroupsAndLayers once', () => {
            spyOn(component, 'sortGroupsAndLayers');
            component.parseMetadata();
            expect(component.sortGroupsAndLayers).toHaveBeenCalledTimes(1);
        });

        describe('metadata "map-editor:group" is present on a layer and not in keyNames', () => {

            beforeEach(() => {
                mapStylingServiceMock.guiLayerSettings = { Meer: { visible: true }};
                mapStylingServiceMock.activeStyling = {
                    layers: [
                        {
                            id: 'Meer',
                            type: 'fill',
                            metadata: {
                                'map-editor:group': 'Gewässer',
                            },
                        }
                    ]
                };
            });

            it('should push group name to keyNames', () => {
                component.parseMetadata();
                expect(component.keyNames).toContain('Gewässer');
            });

            it('should push map-editor:group to groups', () => {
                component.parseMetadata();
                expect(component.groups).toContain({ name: 'Gewässer', guiLayers: []});
            });
        });

        describe('no metadata present in styling', () => {

            beforeEach(() => {
                mapStylingServiceMock.guiLayerSettings = { Meer: { visible: true }};
                mapStylingServiceMock.activeStyling = {
                    layers: [
                        {
                            id: 'Meer',
                            type: 'fill',

                        }
                    ]
                };
            });

            it('should set groups to an empty array', () => {
                component.parseMetadata();
                expect(component.groups).toEqual([]);
            });
        });

        describe('map-editor:layer is present on a layer', () => {

            beforeEach(() => {
                mapStylingServiceMock.guiLayerSettings = { Meer: { visible: true }};
            });

            it('should set groups to an empty array', () => {
                mapStylingServiceMock.activeStyling = {
                    layers: [
                        {
                            id: 'Meer',
                            type: 'fill',
                            metadata: {
                                'map-editor:group': 'Gewässer',
                                'map-editor:layer': 'Meer',
                            },
                        }
                    ]
                };
                component.parseMetadata();
                expect(component.groups).toContain({ name: 'Gewässer', guiLayers: [{name: 'Meer', visible: true, elements: []}]});
            });

        });
    });

    describe('Tests related to sortGroupsAndLayers()', () => {
        it('should sort groups', () => {
            component.groups = [
                { name: 'a', guiLayers: [] },
                { name: 'k', guiLayers: [] },
                { name: 'D', guiLayers: [] },
            ];
            const sortedGroups = [
                { name: 'a', guiLayers: [] },
                { name: 'D', guiLayers: [] },
                { name: 'k', guiLayers: [] },
            ];
            component.sortGroupsAndLayers();
            expect(component.groups).toEqual(sortedGroups);
        });

        it('should sort guiLayers', () => {
            component.groups = [
                { name: 'a', guiLayers: [
                        {name: 'k', visible: true, elements: []},
                        {name: 'i', visible: true, elements: []},
                        {name: 'i', visible: true, elements: []},
                        {name: 'a', visible: true, elements: []},
                        {name: 'O', visible: true, elements: []},
                    ]
                }
            ];
            const sortedGroups = [
                { name: 'a', guiLayers: [
                        {name: 'a', visible: true, elements: []},
                        {name: 'i', visible: true, elements: []},
                        {name: 'i', visible: true, elements: []},
                        {name: 'k', visible: true, elements: []},
                        {name: 'O', visible: true, elements: []},
                    ]
                }
            ];
            component.sortGroupsAndLayers();
            expect(component.groups).toEqual(sortedGroups);
        });
    });

    describe('Tests related to onVisibilityChanged()', () => {

    });

    describe('Tests related to compareNames()', () => {

    });
});
class StylingSStub {
    activeStyling = {
        layers: [
            {
                id: 'Meer',
                type: 'fill',
                metadata: {
                    'map-editor:group': 'Gewässer',
                    'map-editor:layer': 'Meer',
                    'map-editor:layer-element': 'Füllung'
                },
            },
            {
                id: 'Ostsee',
                type: 'fill',
                metadata: {
                    'map-editor:group': 'Gewässer',
                    'map-editor:layer': 'Meer',
                    'map-editor:layer-element': 'Füllung'
                },
            },
            {
                id: 'Kiefern',
                type: 'fill',
                metadata: {
                    'map-editor:group': 'Bäume',
                    'map-editor:layer': 'Meer',
                    'map-editor:layer-element': 'Füllung'
                },
            },
        ],
    };
}
