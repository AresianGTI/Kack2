import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTraineeChartComponent } from './single-trainee-chart.component';

describe('SingleTraineeChartComponent', () => {
  let component: SingleTraineeChartComponent;
  let fixture: ComponentFixture<SingleTraineeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTraineeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTraineeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
