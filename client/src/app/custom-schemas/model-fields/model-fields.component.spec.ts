import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFieldsComponent } from './model-fields.component';

describe('ModelFieldsComponent', () => {
  let component: ModelFieldsComponent;
  let fixture: ComponentFixture<ModelFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
