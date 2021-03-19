import { TestBed } from '@angular/core/testing';

import { GlobalstringsService } from './globalstrings.service';

describe('GlobalstringsService', () => {
  let service: GlobalstringsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalstringsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
