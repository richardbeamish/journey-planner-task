import { TestBed } from '@angular/core/testing';

import { CalculateJourneyService } from './calculate-journey.service';

describe('CalculateJourneyService', () => {
  let service: CalculateJourneyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculateJourneyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
