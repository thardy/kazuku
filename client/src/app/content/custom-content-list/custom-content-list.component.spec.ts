import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomContentListComponent } from './custom-content-list.component';

describe('CustomContentListComponent', () => {
  let component: CustomContentListComponent;
  let fixture: ComponentFixture<CustomContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
