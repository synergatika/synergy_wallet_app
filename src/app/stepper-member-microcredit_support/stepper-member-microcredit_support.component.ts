import { Component, OnInit, OnDestroy, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { WizardComponent } from "angular-archwizard";
import { TranslateService } from '@ngx-translate/core';

import { MessageNoticeService } from '../core/helpers/message-notice/message-notice.service';
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
import { MicrocreditService } from '../core/services/microcredit.service';

import { PaymentList } from 'sng-core';

import { LocalMicrocreditService } from './_microcredit.service';
import { LocalMicrocreditInterface } from './_microcredit.interface';

@Component({
  selector: 'app-stepper-member-microcredit_support',
  templateUrl: './stepper-member-microcredit_support.component.html',
  styleUrls: ['./stepper-member-microcredit_support.component.scss']
})
export class StepperMemberMicrocreditSupportComponent implements OnInit, OnDestroy {

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
  public campaign: LocalMicrocreditInterface["MicrocreditCampaign"];
  public transaction: LocalMicrocreditInterface["Transaction"];

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  /**
   * Component Constructor
   *
   * @param cdr: ChangeDetectorRef
   * @param translate: TranslateService,
   * @param stepperNoticeService: MessageNoticeService
   * @param staticDataService: StaticDataService
   * @param microcreditService: MicrocreditService
   * @param supportService: SupportService
   * @param dialogRef: MatDialogRef<MemberMicrocreditSupportComponent>
   * @param data: any (@Inject(MAT_DIALOG_DATA))
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private stepperNoticeService: MessageNoticeService,
    private staticDataService: StaticDataService,
    private microcreditService: MicrocreditService,
    private stepperService: LocalMicrocreditService,
    public dialogRef: MatDialogRef<StepperMemberMicrocreditSupportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentsList = this.staticDataService.getPaymentsList;

    this.subscription.add(this.stepperService.microcreditCampaign.subscribe(campaign => this.campaign = campaign));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.unsubscribe = new Subject();
  }

  /**
   * On destroy
   */
  ngOnInit() {
    this.campaign = this.data.campaign;
    this.stepperService.changeMicrocreditCampaign(this.campaign);

    this.transaction.partner_id = this.campaign.partner_id;
    this.transaction.campaign_id = this.campaign.campaign_id;
    this.stepperService.changeTransaction(this.transaction);
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.stepperNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  onSubmitAmountForm(event: number) {

    this.loading = true;

    const earnTokens = {
      _amount: this.transaction.amount,
      _method: this.transaction.method,
      paid: this.transaction.paid
    };

    this.microcreditService.earnTokens(this.campaign.partner_id, this.campaign.campaign_id, earnTokens._amount, earnTokens._method, earnTokens.paid)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.transaction.support_id = data.support_id;
            this.transaction.payment_id = data.payment_id;

            this.transaction['how'] = (this.transaction.method == 'store') ?
              {
                title: '',
                value: ''
              } :
              {
                title: this.paymentsList.filter((el) => { return el.bic == this.transaction.method })[0].title,
                value: this.campaign.partner_payments.filter((el) => { return el.bic == this.transaction.method })[0].value
              }

            this.stepperService.changeTransaction(this.transaction);
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
            this.onNextStep();
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_TRANSACTION') + '<br>' +
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

  onFinalStep(event?: boolean) {
    this.dialogRef.close();
  }
}
