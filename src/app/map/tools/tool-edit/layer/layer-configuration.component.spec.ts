import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerConfigurationComponent } from './layer-configuration.component';

describe('LayerConfigurationComponent', () => {
  let component: LayerConfigurationComponent;
  let fixture: ComponentFixture<LayerConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
