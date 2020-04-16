import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFieldComponent } from './model-field.component';

describe('ModelFieldComponent', () => {
  let component: ModelFieldComponent;
  let fixture: ComponentFixture<ModelFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
