import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
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
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { PaymentList } from 'src/app/core/interfaces/payment-list.interface';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-support-microcredit',
  templateUrl: './support-microcredit.component.html',
  styleUrls: ['./support-microcredit.component.sass']
})
export class SupportMicrocreditComponent implements OnInit, OnDestroy {

  /**
   * Wizard Component
   */
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

	/**
	 * Configuration and Static Data
	 */
  public paymentsList: PaymentList[];

  /**
   * Content Variables
   */
  public campaign: SupportInterface["MicrocreditCampaign"];
  public support: SupportInterface["MicrocreditSupport"];

  // campaign_id: string;
  // partner_id: string;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 *
	 * @param cdr: ChangeDetectorRef
	 * @param translate: TranslateService,
	 * @param supportNoticeService: MessageNoticeService
	 * @param staticDataService: StaticDataService
	 * @param microcreditService: MicrocreditService
	 * @param supportService: SupportService
	 * @param dialogRef: MatDialogRef<SupportMicrocreditComponent>
   * @param data: any (@Inject(MAT_DIALOG_DATA))
	 */
  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private supportNoticeService: MessageNoticeService,
    private staticDataService: StaticDataService,
    private microcreditService: MicrocreditService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<SupportMicrocreditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("HEREE", this.data)
    this.paymentsList = this.staticDataService.getPaymentsList;
    // this.partner_id = this.data.partner_id;
    // this.campaign_id = this.data.campaign_id;
    this.supportService.microcreditCurrent.subscribe(campaign => this.campaign = campaign);
    this.subscription.add(this.supportService.microcreditSupport.subscribe(support => this.support = support));
    this.unsubscribe = new Subject();
  }

	/**
	 * On destroy
	 */
  ngOnInit() {
    // this.controlModalState(true);
    this.initializeCurrentCampaignData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    //console.log("On Destory Support Dialog")
    //this.controlModalState(false);

    this.supportNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  // controlModalState(state: boolean) {
  //   if (state) {
  //     const modalState = {
  //       modal: true,
  //       desc: 'Dialog'
  //     };
  //     console.log("Add Fake State")
  //     history.pushState(modalState, null);
  //     console.log(history.state['desc'])
  //   } else {// if (window.history.state.modal) {
  //     console.log("State in Support Dialog")
  //     console.log(window.history.state)
  //     if (window.history.state['desc'] == "Dialog") {
  //       console.log("I am in Support Dialog - Back()")
  //       //window.history.back();
  //     }
  //   }
  // }

  // @HostListener('window:popstate', ['$event'])
  // dismissModal() {
  //   this.controlModalState(false);
  //   this.dialogRef.close();
  // }

  initializeCurrentCampaignData() {
    // const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.campaign = this.data.campaign;
    this.supportService.changeMicrocreditCurrent(this.campaign);

    this.support.partner_id = this.campaign.partner_id;
    this.support.campaign_id = this.campaign.campaign_id;
    this.supportService.changeMicrocreditSupport(this.support);
  }

  onSubmitAmountForm(event: number) {
    const earnTokens = {
      _amount: this.support.amount,
      _method: this.support.method
    };

    this.microcreditService.earnTokens(this.campaign.partner_id, this.campaign.campaign_id, earnTokens._amount, earnTokens._method)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.support.support_id = data.support_id;
            this.support.payment_id = data.payment_id;

            this.support['how'] = (this.support.method == 'store') ? { title: '', value: '' } : {
              title: this.paymentsList.filter((el) => {
                return el.bic == this.support.method
              })[0].title,
              value: this.campaign.partner_payments.filter((el) => {
                return el.bic == this.support.method
              })[0].value
            }

            this.supportService.changeMicrocreditSupport(this.support);
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
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
    //  this.controlModalState(false);
  }
}
