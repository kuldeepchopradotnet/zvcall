import { TestBed } from '@angular/core/testing';

import { DolbyService } from './dolby.service';

describe('DolbyService', () => {
  let service: DolbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DolbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
