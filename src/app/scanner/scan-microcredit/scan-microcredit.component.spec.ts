import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanMicrocreditComponent } from './scan-microcredit.component';

describe('ScanMicrocreditComponent', () => {
  let component: ScanMicrocreditComponent;
  let fixture: ComponentFixture<ScanMicrocreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanMicrocreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanMicrocreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
