import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFacilityChartComponent } from './single-facility-chart.component';

describe('SingleFacilityChartComponent', () => {
  let component: SingleFacilityChartComponent;
  let fixture: ComponentFixture<SingleFacilityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleFacilityChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFacilityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
