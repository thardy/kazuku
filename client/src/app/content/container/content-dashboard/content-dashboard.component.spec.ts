import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDashboardComponent } from './content-dashboard.component';

describe('ContentDashboardComponent', () => {
  let component: ContentDashboardComponent;
  let fixture: ComponentFixture<ContentDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
