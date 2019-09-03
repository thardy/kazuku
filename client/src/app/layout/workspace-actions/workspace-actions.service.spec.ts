import { TestBed } from '@angular/core/testing';

import { WorkspaceActionsService } from './workspace-actions.service';

describe('WorkspaceActionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkspaceActionsService = TestBed.get(WorkspaceActionsService);
    expect(service).toBeTruthy();
  });
});
