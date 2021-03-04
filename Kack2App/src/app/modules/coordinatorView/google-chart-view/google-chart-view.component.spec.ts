import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleChartViewComponent } from './google-chart-view.component';

describe('GoogleChartViewComponent', () => {
  let component: GoogleChartViewComponent;
  let fixture: ComponentFixture<GoogleChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleChartViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
