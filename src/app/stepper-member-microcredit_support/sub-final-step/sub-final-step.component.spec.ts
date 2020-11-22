import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFinalStepComponent } from './sub-final-step.component';

describe('SubFinalStepComponent', () => {
  let component: SubFinalStepComponent;
  let fixture: ComponentFixture<SubFinalStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubFinalStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubFinalStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
