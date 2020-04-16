import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelJsonComponent } from './model-json.component';

describe('ModelJsonComponent', () => {
  let component: ModelJsonComponent;
  let fixture: ComponentFixture<ModelJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
