import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMerchantComponent } from './new-merchant.component';

describe('NewMerchantComponent', () => {
  let component: NewMerchantComponent;
  let fixture: ComponentFixture<NewMerchantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMerchantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
