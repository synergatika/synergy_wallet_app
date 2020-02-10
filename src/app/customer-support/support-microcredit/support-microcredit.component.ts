import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';

import { WizardComponent } from "angular-archwizard";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';

import { MicrocreditService } from '../../core/services/microcredit.service';

import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';
import { takeUntil, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-support-microcredit',
  templateUrl: './support-microcredit.component.html',
  styleUrls: ['./support-microcredit.component.sass']
})
export class SupportMicrocreditComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;

  campaigns: SupportInterface["MicrocreditCampaign"][];
  support: SupportInterface["MicrocreditSupport"];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private microcreditService: MicrocreditService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<SupportMicrocreditComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign_id = this.data.campaign_id;
    this.supportService.microcredit.subscribe(campaigns => this.campaigns = campaigns);
    this.supportService.microcreditSupport.subscribe(support => this.support = support);
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initializeOfferData();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeOfferData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.support.merchant_id = currentCampaign.merchant_id;
    this.support.campaign_id = currentCampaign.campaign_id;
    this.support.minAmount = currentCampaign.minAllowed;
    this.support.maxAmount = (currentCampaign.maxAllowed) ? currentCampaign.maxAllowed : currentCampaign.maxAmount;
    this.supportService.changeMicrocreditSupport(this.support);
  }

  onSubmitAmountForm(event: number) {
    const earnTokens = {
      _merchant_id: this.support.merchant_id,
      _campaign_id: this.support.campaign_id,
      _amount: this.support.amount
    };
    this.microcreditService.earnTokens(earnTokens._merchant_id, earnTokens._campaign_id, earnTokens._amount)
      .pipe(
        tap(
          data => {
            this.support.support_id = data.data.support_id;
            this.support.payment = data.data.payment;
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
