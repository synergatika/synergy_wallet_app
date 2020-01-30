import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerExploreComponent } from './customer-explore.component';

describe('CustomerExploreComponent', () => {
  let component: CustomerExploreComponent;
  let fixture: ComponentFixture<CustomerExploreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerExploreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
