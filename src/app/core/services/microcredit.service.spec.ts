import { TestBed } from '@angular/core/testing';

import { MicrocreditService } from './microcredit.service';

describe('MicrocreditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MicrocreditService = TestBed.get(MicrocreditService);
    expect(service).toBeTruthy();
  });
});
