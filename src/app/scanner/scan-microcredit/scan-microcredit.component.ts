import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subject, Observable, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { TranslateService } from '@ngx-translate/core';
import { MessageNoticeService } from 'src/app/core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { MicrocreditService } from '../../core/services/microcredit.service';

// Local Services
import { ScannerService } from '../_scanner.service';

// Local Models & Interfaces
import { ScannerInterface } from '../_scanner.interface';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-scan-microcredit',
  templateUrl: './scan-microcredit.component.html',
  styleUrls: ['./scan-microcredit.component.scss']
})
export class ScanMicrocreditComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;
  showIdentifierForm = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  user: ScannerInterface["User"];
  campaigns: ScannerInterface["MicrocreditCampaign"][];
  transaction: ScannerInterface["MicrocreditTransaction"];
  supports: ScannerInterface["MicrocreditSupport"][];

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private scannerNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private microcreditService: MicrocreditService,
    private scannerService: ScannerService,
    public dialogRef: MatDialogRef<ScanMicrocreditComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign_id = this.data.campaign_id;
    this.subscription.add(this.scannerService.microcredit.subscribe(campaigns => this.campaigns = campaigns));
    this.subscription.add(this.scannerService.microcreditTransaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.scannerService.microcreditSupports.subscribe(supports => this.supports = supports));
    this.subscription.add(this.scannerService.user.subscribe(user => this.user = user));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.initializeCampaignData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.scannerNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initializeCampaignData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.transaction.campaign_id = currentCampaign.campaign_id;
    this.scannerService.changeMicrocreditTransaction(this.transaction);
  }

  fetchBackerData() {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.microcreditService.readBackerSupportsByMicrocreditCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, (identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            this.supports = data as any;
            console.log(this.supports);
            this.scannerService.changeMicrocreditSupports(this.supports);
            const currentSupport = this.supports.find(support => (support.initialTokens - support.redeemedTokens > 0) && (support.status === 'confirmation'));
            console.log(currentSupport);
            if (currentSupport) {
              this.transaction.support_id = currentSupport.support_id;
              this.transaction.initial_tokens = currentSupport.initialTokens;
              this.transaction.redeemed_tokens = currentSupport.redeemedTokens;
              this.transaction.possible_tokens = (this.transaction.initial_tokens - this.transaction.redeemed_tokens);
              this.scannerService.changeMicrocreditTransaction(this.transaction);
            }
            if (!this.transaction.possible_tokens) {
              this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NOT_ENOUGH_TOKENS'), 'danger');
            }
            this.onNextStep();
          },
          error => {
            this.scannerNoticeService.setNotice(this.translate.instant(error), 'danger');
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

  onSuccessScanIdentifier(event: string) {
    this.fetchBackerData();
  }

  onSubmitIdentifierForm(event: string) {
    this.fetchBackerData();
  }

  onSubmitMicrocreditForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const redeemTokens = {
      _to: (identifier).toLowerCase(),
      _tokens: this.transaction.discount_tokens,
      password: 'all_ok',
      support_id: this.transaction.support_id
    };

    this.microcreditService.redeemTokens(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, redeemTokens._to, redeemTokens._tokens, redeemTokens.password, redeemTokens.support_id)
      .pipe(
        tap(
          data => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCESS_TRANSACTION'), 'success');
            this.onNextStep();
          },
          error => {
            this.scannerNoticeService.setNotice(
              this.translate.instant('WIZARD_MESSAGES.ERROR_REDEEM_TOKENS') + '<br>' +
              this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
  }

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.scannerNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event = null) {
    this.dialogRef.close();
  }
}
