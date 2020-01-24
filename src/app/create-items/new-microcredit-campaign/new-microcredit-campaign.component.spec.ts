import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMicrocreditCampaignComponent } from './new-microcredit-campaign.component';

describe('NewMicrocreditCampaignComponent', () => {
  let component: NewMicrocreditCampaignComponent;
  let fixture: ComponentFixture<NewMicrocreditCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMicrocreditCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMicrocreditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
