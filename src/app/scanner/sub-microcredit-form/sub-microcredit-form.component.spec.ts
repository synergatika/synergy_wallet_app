import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMicrocreditFormComponent } from './sub-microcredit-form.component';

describe('SubMicrocreditFormComponent', () => {
  let component: SubMicrocreditFormComponent;
  let fixture: ComponentFixture<SubMicrocreditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMicrocreditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMicrocreditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
