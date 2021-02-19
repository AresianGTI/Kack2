import { TestBed } from '@angular/core/testing';

import { SomeserviceService } from './someservice.service';

describe('SomeserviceService', () => {
  let service: SomeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SomeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
