import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityDialogComponent } from './facility-dialog.component';

describe('FacilityDialogComponent', () => {
  let component: FacilityDialogComponent;
  let fixture: ComponentFixture<FacilityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
