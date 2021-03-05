import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeInformationComponent } from './trainee-information.component';

describe('TraineeInformationComponent', () => {
  let component: TraineeInformationComponent;
  let fixture: ComponentFixture<TraineeInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
