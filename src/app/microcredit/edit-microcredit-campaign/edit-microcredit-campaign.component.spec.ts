import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMicrocreditCampaignComponent } from './edit-microcredit-campaign.component';

describe('EditMicrocreditCampaignComponent', () => {
  let component: EditMicrocreditCampaignComponent;
  let fixture: ComponentFixture<EditMicrocreditCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMicrocreditCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMicrocreditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
