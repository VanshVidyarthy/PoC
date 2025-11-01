import { TestBed } from '@angular/core/testing';

import { SecurityApi } from './security-api';

describe('SecurityApi', () => {
  let service: SecurityApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
