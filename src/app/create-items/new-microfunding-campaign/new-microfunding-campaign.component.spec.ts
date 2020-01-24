import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMicrofundingCampaignComponent } from './new-microfunding-campaign.component';

describe('NewMicrofundingCampaignComponent', () => {
  let component: NewMicrofundingCampaignComponent;
  let fixture: ComponentFixture<NewMicrofundingCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMicrofundingCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMicrofundingCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
