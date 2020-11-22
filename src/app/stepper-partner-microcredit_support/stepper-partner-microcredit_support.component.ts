import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { WizardComponent } from 'angular-archwizard';

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
  selector: 'app-stepper-partner-microcredit_support',
  templateUrl: './stepper-partner-microcredit_support.component.html',
  styleUrls: ['./stepper-partner-microcredit_support.component.scss']
})
export class StepperPartnerMicrocreditSupportComponent implements OnInit, OnDestroy {

  /**
   * Wizard Component
   */
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  /**
   * Content Variables
   */
  public user: LocalMicrocreditInterface["User"];
  public actions: LocalMicrocreditInterface["Actions"];
  public campaign: LocalMicrocreditInterface["MicrocreditCampaign"];
  public transaction: LocalMicrocreditInterface["Transaction"];

  showIdentifierForm: boolean = false;
  showEmailForm: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private stepperNoticeService: MessageNoticeService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService,
    private stepperService: LocalMicrocreditService,
    public dialogRef: MatDialogRef<StepperPartnerMicrocreditSupportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription.add(this.stepperService.user.subscribe(user => this.user = user));
    this.subscription.add(this.stepperService.actions.subscribe(actions => this.actions = actions));
    this.subscription.add(this.stepperService.microcreditCampaign.subscribe(campaign => this.campaign = campaign));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.campaign = this.data.campaign
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

  /**
   * Step A1: Callback from Identifier Scanning
   * 
   * @param event 
   */
  onSuccessScanIdentifier(event: string) {
    this.user.identifier_scan = event;
    this.stepperService.changeUser(this.user);

    this.authenticationService.checkIdentifier((this.user.identifier_scan).toLowerCase())
      .pipe(
        tap(
          data => {
            this.actions.registration = (this.actions.registration).slice(0, -4)
              + '0'
              + this.checkRegistrationOnIdentifier(data.status);
            this.stepperService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.stepperNoticeService.setNotice(this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
   * Step A2: Callback from Identifier Form
   * 
   * @param event 
   */
  onSubmitIdentifierForm(event: string) {
    this.user.identifier_form = event;
    this.stepperService.changeUser(this.user);

    this.authenticationService.checkIdentifier((this.user.identifier_form).toLowerCase())
      .pipe(
        tap(
          data => {
            this.actions.registration = (this.actions.registration).slice(0, -4)
              + '1'
              + this.checkRegistrationOnIdentifier(data.status);
            this.stepperService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.stepperNoticeService.setNotice(this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  /**
   * Step B: Callback from Email Form
   * 
   * @param event 
   */
  onSubmitEmailForm(event: string) {
    if (event) {

      this.user.email = event;
      this.stepperService.changeUser(this.user);

      this.authenticationService.checkIdentifier((this.user.email).toLowerCase())
        .pipe(
          tap(
            data => {
              console.log(data);
              this.actions.registration = (this.actions.registration).slice(0, -6)
                + this.checkRegistrationOnEmail(data.status)
                + this.actions.registration.substr(this.actions.registration.length - 4);
              this.stepperService.changeActions(this.actions);
            },
            error => {
              console.log(error);
              this.stepperNoticeService.setNotice(this.translate.instant(error), 'danger');
            }),
          takeUntil(this.unsubscribe),
          finalize(() => {
            this.loading = false;
            this.cdRef.markForCheck();
          })
        )
        .subscribe();
    } else {
      this.actions.registration = (this.actions.registration).slice(0, -6)
        + '00'
        + this.actions.registration.substr(this.actions.registration.length - 4);
      this.stepperService.changeActions(this.actions);
      this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NO_EMAIL_WILL_LINK'), 'warning');
      this.onNextStep();
    }
  }

  /**
   * Step C: Callback from Amount Form
   * 
   * @param event 
   */
  onSubmitAmountForm(event: number) {
    // if ((this.actions.registration).length < 5) {
    //   this.actions.registration = 'xx' + this.actions.registration;
    //   this.stepperService.changeActions(this.actions);
    // }
    console.log("Registration: " + this.actions.registration)

    this.actionsHandler();
  }

  /**
   * Check if Card Number or Email from Step A1,A2 Exists
   * 
   * @param status; 'email_both', 'email_none', 'email_no_card', 'card_both', 'card_none', 'card_no_email',
   */
  checkRegistrationOnIdentifier(status: string) {
    let action: string = 'xxx';
    let type: string = '', message: string = '';
    this.showEmailForm = false;

    switch (status) {
      case 'email_both': action = '011'; this.onAfterNextStep(2); break; // No action
      case 'email_none': {
        action = '000';
        type = 'success';
        message = this.translate.instant('WIZARD_MESSAGES.NEW_EMAIL');
        this.onAfterNextStep(2);
        break;
      }
      case 'email_no_card': action = '010'; this.onAfterNextStep(2); break;// No action
      case 'card_both': action = '111'; this.onAfterNextStep(2); break;// No action
      case 'card_none': {
        action = '100';
        type = 'success';
        message = this.translate.instant('WIZARD_MESSAGES.NEW_CARD');
        this.showEmailForm = true;
        this.onNextStep();
        break;
      } // OR action = '0100' // Full Registration OR Link Card
      case 'card_no_email': {
        action = '101' // OR action = '0000' // Link Email OR No Action
        type = 'success';
        message = this.translate.instant('WIZARD_MESSAGES.EXISTING_CARD');
        this.showEmailForm = true;
        this.onNextStep();
        break;
      }
      default: type = 'danger'; message = this.translate.instant('WIZARD_MESSAGES.ERROR'); break;
    }
    this.stepperNoticeService.setNotice(message, type);
    return action;
  }


  /**
   * Check if Email from Step B Exists
   * 
   * @param status; 'email_both', 'email_none', 'email_no_card'
   */
  checkRegistrationOnEmail(status: string) {
    let action: string = 'xx';
    let type: string = '', message: string = '';

    switch (status) {
      case 'email_both': {
        action = '11';
        type = 'danger';
        message = this.translate.instant('WIZARD_MESSAGES.EMAIL_HAS_CARD');
        break;
      }
      case 'email_none': {
        action = '10'
        type = 'success';
        message = this.translate.instant('WIZARD_MESSAGES.EMAIL_WILL_LINK');
        this.onNextStep();
        break;
      }
      case 'email_no_card': {
        action = '11';
        type = 'success';
        message = this.translate.instant('WIZARD_MESSAGES.CARD_WILL_LINK');
        this.onNextStep();
        break;
      }
      default: type = 'danger'; message = this.translate.instant('WIZARD_MESSAGES.ERROR'); break;
    }
    this.stepperNoticeService.setNotice(message, type);
    return action;
  }

  /**
   * Deside the registration action (Registration, Link Email, Link Card)
   */
  actionsHandler() {
    const user = {
      identifier: this.user.identifier_scan || this.user.identifier_form,
      email: this.user.email
    };

    switch (this.actions.registration) {
      case 'xx1000': { // only email
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED_EMAIL') }, user.identifier, null)
        break;
      }
      case 'xx0000': { // only email
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED_EMAIL') }, user.identifier, null)
        break;
      }
      case '000100': { // only card
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED_CARD') }, null, user.identifier);
        break;
      }
      case '001100': { // only card
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED_CARD') }, null, user.identifier);
        break;
      }
      case '100100': { // email_card
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED') }, user.email, user.identifier);
        break;
      }
      case '101100': { // email_card
        this.actionRegistration(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.USER_CREATED') }, user.email, user.identifier);
        break;
      }
      case '100101': { //link_email
        this.actionLinkEmail(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.LINK_EMAIL') }, user.email, user.identifier);

        break;
      }
      case '101101': { //link_email
        this.actionLinkEmail(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.LINK_EMAIL') }, user.email, user.identifier);
        break;
      }
      case '110100': { //link_card
        this.actionLinkCard(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.LINK_CARD') }, user.email, user.identifier);
        break;
      }
      case '111100': { //link_card
        this.actionLinkCard(
          { type: 'success', message: this.translate.instant('WIZARD_MESSAGES.LINK_CARD') }, user.email, user.identifier);
        break;
      }
      default: {
        this.stepperNoticeService.setNotice('', 'success');
        this.earnTokens({ type: '', message: '' });
        break;
      }
    }
  }

  actionRegistration(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Reg', email + card)
    this.authenticationService.register_member(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.earnTokens(notice);
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_REGISTRATION') + '<br>' +
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

  actionLinkCard(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Card', email + card)
    this.authenticationService.linkCard(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.earnTokens(notice);
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_CARD') + '<br>' +
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

  actionLinkEmail(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Email', email + card);
    this.authenticationService.linkEmail(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.earnTokens(notice);
          },
          error => {
            this.stepperNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_EMAIL') + '<br>' +
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

  earnTokens(notice: { type: string, message: string }) {
    const identifier = this.user.identifier_scan || this.user.identifier_form;
    const earnTokens = {
      _to: (identifier).toLowerCase(),
      _amount: this.transaction.amount,
    };

    this.microcreditService.earnTokensByPartner(this.authenticationService.currentUserValue.user["_id"], this.campaign.campaign_id, earnTokens._to, earnTokens._amount,
      // (this.support.paid) ? 'store' : 'none', this.support.paid)
      'store', this.transaction.paid)
      .pipe(
        tap(
          data => {
            this.transaction.support_id = data.support_id;
            this.transaction.payment_id = data.payment_id;
            this.stepperService.changeTransaction(this.transaction);

            let message = (notice.message) ?
              notice.message + '<br>' + this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION') :
              this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION');

            this.stepperNoticeService.setNotice(message, 'success');
            this.onNextStep();
          },
          error => {
            let message = (notice.message) ?
              notice.message + '<br> but ' + this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION') :
              this.translate.instant('WIZARD_MESSAGES.ERROR_TRANSACTION') + '<br>' +
              this.translate.instant(error);

            this.stepperNoticeService.setNotice(message, 'danger');
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

  onAfterNextStep(step: number) {
    this.wizard.goToStep(step);
  }

  onPreviousStep(event: boolean) {
    this.stepperNoticeService.setNotice(null);
    if (this.wizard.currentStep.stepTitle === 'Amount' && !this.showEmailForm) {
      this.onAfterNextStep(0);
      return;
    };
    this.wizard.goToPreviousStep();
  }

  onFinalStep(final: boolean, event: Event) {
    this.dialogRef.close(final);
    // this.controlModalState(false);
  }
}
