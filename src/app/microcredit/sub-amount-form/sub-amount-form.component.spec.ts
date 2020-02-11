import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAmountFormComponent } from './sub-amount-form.component';

describe('SubAmountFormComponent', () => {
  let component: SubAmountFormComponent;
  let fixture: ComponentFixture<SubAmountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAmountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAmountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
