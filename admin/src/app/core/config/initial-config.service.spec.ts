import { TestBed } from '@angular/core/testing';

import { InitialConfigService } from './initial-config.service';

describe('InitialConfigService', () => {
  let service: InitialConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
