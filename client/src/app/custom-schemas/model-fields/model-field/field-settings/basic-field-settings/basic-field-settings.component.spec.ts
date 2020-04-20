import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFieldSettingsComponent } from './basic-field-settings.component';

describe('BasicFieldSettingsComponent', () => {
  let component: BasicFieldSettingsComponent;
  let fixture: ComponentFixture<BasicFieldSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicFieldSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFieldSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
