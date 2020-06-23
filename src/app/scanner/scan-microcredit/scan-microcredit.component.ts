import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';

/**
 * Services
 */
import { MessageNoticeService } from 'src/app/core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { MicrocreditService } from '../../core/services/microcredit.service';

/**
 * Local Services & Interfaces
 */
import { ScannerService } from '../_scanner.service';
import { ScannerInterface } from '../_scanner.interface';

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
    // this.controlModalState(true);
    this.initializeCampaignData();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    // this.controlModalState(false);

    this.scannerNoticeService.setNotice(null);
    this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  // controlModalState(state: boolean) {
  //   if (state) {
  //     const modalState = {
  //       modal: true,
  //       desc: 'fake state for our modal'
  //     };
  //     history.pushState(modalState, null);
  //   } else if (window.history.state.modal) {
  //     history.back();
  //   }
  // }

  // @HostListener('window:popstate', ['$event'])
  // dismissModal() {
  //   this.dialogRef.close();
  // }


  initializeCampaignData() {
    const currentCampaign = this.campaigns[this.campaigns.map(function (e) { return e.campaign_id; }).indexOf(this.campaign_id)];
    this.transaction.campaign_id = currentCampaign.campaign_id;
    console.log(currentCampaign)
    this.transaction.campaign_title = currentCampaign.title;
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

    this.loading = true;

    this.microcreditService.redeemTokens(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, redeemTokens._to, redeemTokens._tokens, redeemTokens.password, redeemTokens.support_id)
      .pipe(
        tap(
          data => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
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

  onPreviousStep(event: boolean) {
    this.scannerNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event = null) {
    this.dialogRef.close();
    // this.controlModalState(false);
  }
}
