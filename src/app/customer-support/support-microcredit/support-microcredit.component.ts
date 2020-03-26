import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from "angular-archwizard";

import { TranslateService } from '@ngx-translate/core';
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
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

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  public campaigns: SupportInterface["MicrocreditCampaign"][];
  public current: SupportInterface["MicrocreditCampaign"];
  public support: SupportInterface["MicrocreditSupport"];

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private supportNoticeService: MessageNoticeService,
    private microcreditService: MicrocreditService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<SupportMicrocreditComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.merchant_id = this.data.merchant_id;
    this.campaign_id = this.data.campaign_id;
    this.subscription.add(this.supportService.microcreditCampaigns.subscribe(campaigns => this.campaigns = campaigns));
    this.subscription.add(this.supportService.microcreditSupport.subscribe(support => this.support = support));
    this.unsubscribe = new Subject();
  }

	/**
	 * On destroy
	 */
  ngOnInit() {
    this.initializeCurrentCampaignData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.supportNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeCurrentCampaignData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.current = currentCampaign;
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

    this.microcreditService.earnTokens(this.current.merchant_id, this.current.campaign_id, earnTokens._amount, earnTokens._method)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.support.support_id = data.support_id;
            this.support.payment_id = data.payment_id;
            this.support.how = data.how;
            this.supportService.changeMicrocreditSupport(this.support);
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCESS_TRANSACTION'), 'success');
            this.onNextStep();
          },
          error => {
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_TRANSACTION') + '<br>' +
              this.translate.instant(error), 'danger');
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

  onFinalStep(event = null) {
    this.dialogRef.close();
  }
}
