import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoordinatorDialogComponent } from './create-coordinator-dialog.component';

describe('CreateCoordinatorDialogComponent', () => {
  let component: CreateCoordinatorDialogComponent;
  let fixture: ComponentFixture<CreateCoordinatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCoordinatorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCoordinatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
