import { TestBed } from '@angular/core/testing';

import { ContentModelService } from './content-model.service';

describe('ContentModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContentModelService = TestBed.get(ContentModelService);
    expect(service).toBeTruthy();
  });
});
