import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExploreOneComponent } from './customer-explore-one.component';

describe('CustomerExploreOneComponent', () => {
  let component: CustomerExploreOneComponent;
  let fixture: ComponentFixture<CustomerExploreOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerExploreOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExploreOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
