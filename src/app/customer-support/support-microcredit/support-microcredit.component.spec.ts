import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMicrocreditComponent } from './support-microcredit.component';

describe('SupportMicrocreditComponent', () => {
  let component: SupportMicrocreditComponent;
  let fixture: ComponentFixture<SupportMicrocreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportMicrocreditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportMicrocreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
