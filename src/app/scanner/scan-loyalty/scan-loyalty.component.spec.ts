import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanLoyaltyComponent } from './scan-loyalty.component';

describe('ScanLoyaltyComponent', () => {
  let component: ScanLoyaltyComponent;
  let fixture: ComponentFixture<ScanLoyaltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanLoyaltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanLoyaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
