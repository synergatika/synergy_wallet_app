import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanOffersComponent } from './scan-offers.component';

describe('ScanOffersComponent', () => {
  let component: ScanOffersComponent;
  let fixture: ComponentFixture<ScanOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
