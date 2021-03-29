import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityChartComponent } from './facility-chart.component';

describe('FacilityChartComponent', () => {
  let component: FacilityChartComponent;
  let fixture: ComponentFixture<FacilityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
