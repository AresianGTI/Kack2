import { TestBed } from '@angular/core/testing';

import { SubscriptionCollectionService } from './subscription-collection.service';

describe('SubscriptionCollectionService', () => {
  let service: SubscriptionCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
