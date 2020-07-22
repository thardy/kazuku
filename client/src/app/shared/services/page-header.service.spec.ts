import { TestBed } from '@angular/core/testing';

import { PageHeaderService } from './page-header.service';

describe('PageHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageHeaderService = TestBed.get(PageHeaderService);
    expect(service).toBeTruthy();
  });
});
