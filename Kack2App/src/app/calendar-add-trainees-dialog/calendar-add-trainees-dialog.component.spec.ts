import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAddTraineesDialogComponent } from './calendar-add-trainees-dialog.component';

describe('CalendarAddTraineesDialogComponent', () => {
  let component: CalendarAddTraineesDialogComponent;
  let fixture: ComponentFixture<CalendarAddTraineesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarAddTraineesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarAddTraineesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
