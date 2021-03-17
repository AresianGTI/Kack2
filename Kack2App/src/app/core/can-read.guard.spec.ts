import { TestBed } from '@angular/core/testing';

import { CanReadGuard } from './can-read.guard';

describe('CanReadGuard', () => {
  let guard: CanReadGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanReadGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
