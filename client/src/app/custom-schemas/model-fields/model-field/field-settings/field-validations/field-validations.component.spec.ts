import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldValidationsComponent } from './field-validations.component';

describe('FieldValidationsComponent', () => {
  let component: FieldValidationsComponent;
  let fixture: ComponentFixture<FieldValidationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldValidationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
