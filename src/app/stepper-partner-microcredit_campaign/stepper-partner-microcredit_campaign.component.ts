import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';

/**
 * Components
 */
import { SubMicrocreditFormComponent } from "./sub-microcredit-form/sub-microcredit-form.component";

/**
 * Services
 */
import { MessageNoticeService } from 'src/app/core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { MicrocreditService } from '../core/services/microcredit.service';

/**
 * Local Services & Interfaces
 */
import { LocalMicrocreditService } from './_microcredit.service';
import { LocalMicrocreditInterface } from './_microcredit.interface';

@Component({
  selector: 'app-stepper-partner-microcredit_campaign',
  templateUrl: './stepper-partner-microcredit_campaign.component.html',
  styleUrls: ['./stepper-partner-microcredit_campaign.component.scss']
})
export class StepperPartnerMicrocreditCampaignComponent implements OnInit, OnDestroy {
  /**
   * Imported Component
   */
  @ViewChild(SubMicrocreditFormComponent, { static: true })
  public microcreditForm: SubMicrocreditFormComponent;

  /**
   * Wizard Component
   */
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  /**
   * Content Variables
   */
  public user: LocalMicrocreditInterface["User"];
  public campaign: LocalMicrocreditInterface["MicrocreditCampaign"];
  public supports: LocalMicrocreditInterface["MicrocreditSupport"][];
  public transaction: LocalMicrocreditInterface["Transaction"];

  /**
   * Flag Variables
   */
  showIdentifierForm = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private stepperNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private microcreditService: MicrocreditService,
    private stepperService: LocalMicrocreditService,
    public dialogRef: MatDialogRef<StepperPartnerMicrocreditCampaignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription.add(this.stepperService.user.subscribe(user => this.user = user));
    this.subscription.add(this.stepperService.microcreditCampaign.subscribe(campaign => this.campaign = campaign));
    this.subscription.add(this.stepperService.microcreditSupports.subscribe(supports => this.supports = supports));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.campaign = this.data.campaign;
    this.stepperService.changeMicrocreditCampaign(this.campaign);

    this.transaction.campaign_id = this.campaign.campaign_id;
    this.transaction.campaign_title = this.campaign.title;
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

  /**
   * Step A1: Callback from Identifier Scanning
   * 
   * @param event 
   */
  onSuccessScanIdentifier(event: string) {
    this.user.identifier_scan = event;
    this.stepperService.changeUser(this.user);

    this.fetchBackerData();
  }

  /**
   * Step A2: Callback from Identifier Form
   * 
   * @param event 
   */
  onSubmitIdentifierForm(event: string) {
    this.user.identifier_form = event;
    this.stepperService.changeUser(this.user);

    this.fetchBackerData();
  }

  /**
   * Step B: Callback from Microcredit Form
   * 
   * @param event 
   */
  onSubmitMicrocreditForm(event: number) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const redeemTokens = {
      _to: (identifier).toLowerCase(),
      _tokens: this.transaction.discount_tokens,
      password: 'all_ok',
      support_id: this.transaction.support_id
    };

    this.loading = true;

    this.microcreditService.redeemTokens(this.authenticationService.currentUserValue.user["_id"], this.campaign.campaign_id, redeemTokens._to, redeemTokens._tokens, redeemTokens.password, redeemTokens.support_id)
      .pipe(
        tap(
          data => {
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
            this.onNextStep();
          },
          error => {
            this.stepperNoticeService.setNotice(
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

  fetchBackerData() {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    this.microcreditService.readBackerSupportsByMicrocreditCampaign(this.authenticationService.currentUserValue.user["_id"], this.campaign.campaign_id, (identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            this.supports = data as any;
            console.log(this.supports);
            this.stepperService.changeMicrocreditSupports(this.supports);
            const canRedeem = (this.supports.filter(support => (support.initialTokens - support.redeemedTokens > 0) && (support.status === 'confirmation'))).length > 0;
            if (!canRedeem) {
              this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NOT_ENOUGH_TOKENS'), 'danger');
            }
            this.microcreditForm.initializeSelectedSupport();
            this.onNextStep();
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant(error), 'danger');
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

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
  }

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep(event: boolean) {
    this.stepperNoticeService.setNotice(null);
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event = null) {
    this.dialogRef.close();
  }
}
