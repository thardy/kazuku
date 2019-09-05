import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceActionsComponent } from './workspace-actions.component';

describe('WorkspaceActionsComponent', () => {
  let component: WorkspaceActionsComponent;
  let fixture: ComponentFixture<WorkspaceActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
