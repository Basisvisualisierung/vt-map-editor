import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayerConfigurationComponent } from './base-layer-configuration.component';

describe('BaseLayerComponent', () => {
  let component: BaseLayerConfigurationComponent;
  let fixture: ComponentFixture<BaseLayerConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLayerConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
