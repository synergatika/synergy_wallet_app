import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubOfferFormComponent } from './sub-offer-form.component';

describe('SubOfferFormComponent', () => {
  let component: SubOfferFormComponent;
  let fixture: ComponentFixture<SubOfferFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubOfferFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubOfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
