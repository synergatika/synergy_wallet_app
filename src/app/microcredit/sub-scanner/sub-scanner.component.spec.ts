import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubScannerComponent } from './sub-scanner.component';

describe('SubScannerComponent', () => {
  let component: SubScannerComponent;
  let fixture: ComponentFixture<SubScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubScannerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
