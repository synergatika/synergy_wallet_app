import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from "angular-archwizard";

import { MicrocreditService } from '../../core/services/microcredit.service';
import { ItemsService } from '../../core/services/items.service';

import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';

@Component({
  selector: 'app-support-microcredit',
  templateUrl: './support-microcredit.component.html',
  styleUrls: ['./support-microcredit.component.sass']
})
export class SupportMicrocreditComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;
  merchant_id: string;

  campaigns: SupportInterface["MicrocreditCampaign"][];
  current: SupportInterface["MicrocreditCampaign"];
  support: SupportInterface["MicrocreditSupport"];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private itemsService: ItemsService,
    private microcreditService: MicrocreditService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<SupportMicrocreditComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.merchant_id = this.data.merchant_id;
    this.campaign_id = this.data.campaign_id;
    this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns);
    this.supportService.microcreditSupport.subscribe(support => this.support = support);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeCurrentCampaignData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeCurrentCampaignData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.current = currentCampaign;
    console.log(this.current);
    this.supportService.changeMicrocreditCurrent(this.current);

    this.support.merchant_id = currentCampaign.merchant_id;
    this.support.campaign_id = currentCampaign.campaign_id;
    this.supportService.changeMicrocreditSupport(this.support);
  }

  onSubmitAmountForm(event: number) {
    const earnTokens = {
      _amount: this.support.amount,
      _method: this.support.method
    };
    console.log("submitted");
    this.microcreditService.earnTokens(this.current.merchant_id, this.current.campaign_id, earnTokens._amount, earnTokens._method)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.support.support_id = data.data.support_id;
            this.support.payment_id = data.data.payment_id;
            this.support.how = data.data.how;
            this.supportService.changeMicrocreditSupport(this.support);
            this.onNextStep();
          },
          error => {
            console.log(error);
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event) {
    this.dialogRef.close();
  }
}
