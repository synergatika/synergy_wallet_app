import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDiscountFormComponent } from './sub-discount-form.component';

describe('SubDiscountFormComponent', () => {
  let component: SubDiscountFormComponent;
  let fixture: ComponentFixture<SubDiscountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubDiscountFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubDiscountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
