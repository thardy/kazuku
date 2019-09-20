import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentModelDashboardComponent } from './content-model-dashboard.component';

describe('ContentModelDashboardComponent', () => {
  let component: ContentModelDashboardComponent;
  let fixture: ComponentFixture<ContentModelDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentModelDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentModelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
