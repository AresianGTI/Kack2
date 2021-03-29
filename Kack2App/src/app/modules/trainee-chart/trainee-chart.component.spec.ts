import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeChartComponent } from './trainee-chart.component';

describe('TraineeChartComponent', () => {
  let component: TraineeChartComponent;
  let fixture: ComponentFixture<TraineeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
