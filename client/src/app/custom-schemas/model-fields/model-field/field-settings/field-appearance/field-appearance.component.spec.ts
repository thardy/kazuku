import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAppearanceComponent } from './field-appearance.component';

describe('FieldAppearanceComponent', () => {
  let component: FieldAppearanceComponent;
  let fixture: ComponentFixture<FieldAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldAppearanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
