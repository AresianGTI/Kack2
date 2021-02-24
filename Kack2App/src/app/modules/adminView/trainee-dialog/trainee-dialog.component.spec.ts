import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeDialogComponent } from './trainee-dialog.component';

describe('TraineeDialogComponent', () => {
  let component: TraineeDialogComponent;
  let fixture: ComponentFixture<TraineeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraineeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
