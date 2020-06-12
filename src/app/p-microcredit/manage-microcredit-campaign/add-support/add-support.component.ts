import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
// Global Services
import { TranslateService } from '@ngx-translate/core';
import { MessageNoticeService } from 'src/app/core/helpers/message-notice/message-notice.service';
import { MicrocreditService } from '../../../core/services/microcredit.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
// Local Services, Models & Interfaces
import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';
// Others
import { WizardComponent } from 'angular-archwizard';

@Component({
  selector: 'app-add-support',
  templateUrl: './add-support.component.html',
  styleUrls: ['./add-support.component.scss']
})
export class AddSupportComponent implements OnInit, OnDestroy {

  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  campaign_id: string;
  showIdentifierForm: boolean = false;
  showEmailForm: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  public user: SupportInterface["User"];
  public campaign: SupportInterface["MicrocreditCampaign"];
  public support: SupportInterface["MicrocreditSupport"];
  public actions: SupportInterface["Actions"];

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private supportNoticeService: MessageNoticeService,
    private microcreditService: MicrocreditService,
    private authenticationService: AuthenticationService,
    private supportService: SupportService,
    public dialogRef: MatDialogRef<AddSupportComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.campaign_id = this.data.campaign_id;
    this.subscription.add(this.supportService.microcreditSupport.subscribe(support => this.support = support));
    this.subscription.add(this.supportService.microcreditCurrent.subscribe(campaign => this.campaign = campaign));
    this.subscription.add(this.supportService.user.subscribe(user => this.user = user));
    this.subscription.add(this.supportService.actions.subscribe(actions => this.actions = actions));
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
	 */
  ngOnInit() {
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

  checkRegistrationOnIdentifier(status: string) {
    let action: string = 'xxxx';
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
    this.supportNoticeService.setNotice(message, type);
    return action;
  }

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
    this.supportNoticeService.setNotice(message, type);
    return action;
  }

  onSuccessScanIdentifier(event: string) {
    this.authenticationService.checkIdentifier((this.user.identifier_scan).toLowerCase())
      .pipe(
        tap(
          data => {
            this.actions.registration = '0' + this.checkRegistrationOnIdentifier(data.status);
            this.supportService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.supportNoticeService.setNotice(this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  onSubmitIdentifierForm(event: string) {
    this.authenticationService.checkIdentifier((this.user.identifier_form).toLowerCase())
      .pipe(
        tap(
          data => {
            this.actions.registration = '1' + this.checkRegistrationOnIdentifier(data.status);
            this.supportService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.supportNoticeService.setNotice(this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  onSubmitEmailForm(event: string) {
    if (event) {
      this.authenticationService.checkIdentifier((this.user.email).toLowerCase())
        .pipe(
          tap(
            data => {
              console.log(data);
              this.actions.registration = this.checkRegistrationOnEmail(data.status) + this.actions.registration.substr(this.actions.registration.length - 4);
              console.log("Action on Email")
              console.log(this.actions.registration);
              this.supportService.changeActions(this.actions);
            },
            error => {
              console.log(error);
              this.supportNoticeService.setNotice(this.translate.instant(error), 'danger');
            }),
          takeUntil(this.unsubscribe),
          finalize(() => {
            this.loading = false;
            this.cdRef.markForCheck();
          })
        )
        .subscribe();
    } else {
      this.actions.registration = '00' + this.actions.registration.substr(this.actions.registration.length - 4);
      this.supportService.changeActions(this.actions);
      this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NO_EMAIL_WILL_LINK'), 'warning');
      this.onNextStep();
    }
  }

  onSubmitAmountForm(event: number) {
    if ((this.actions.registration).length < 5) {
      this.actions.registration = 'xx' + this.actions.registration;
      this.supportService.changeActions(this.actions);
    }
    this.actionsHandler();
  }

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
        this.supportNoticeService.setNotice('', 'success');
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
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_REGISTRATION') + '<br>' +
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
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_CARD') + '<br>' +
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
            this.supportNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_EMAIL') + '<br>' +
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
      _amount: this.support.amount,
    };

    this.microcreditService.earnTokensByPartner(this.authenticationService.currentUserValue.user["_id"], this.campaign_id, earnTokens._to, earnTokens._amount, (this.support.paid) ? 'store' : 'none', this.support.paid)
      .pipe(
        tap(
          data => {
            this.support.support_id = data.support_id;
            this.support.payment_id = data.payment_id;
            this.supportService.changeMicrocreditSupport(this.support);

            let message = (notice.message) ?
              notice.message + '<br>' + this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION') :
              this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION');

            this.supportNoticeService.setNotice(message, 'success');
            this.onNextStep();
          },
          error => {
            let message = (notice.message) ?
              notice.message + '<br> but ' + this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION') :
              this.translate.instant('WIZARD_MESSAGES.ERROR_TRANSACTION') + '<br>' +
              this.translate.instant(error);

            this.supportNoticeService.setNotice(message, 'danger');
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
    this.supportNoticeService.setNotice(null);
    if (this.wizard.currentStep.stepTitle === 'Amount' && !this.showEmailForm) {
      this.onAfterNextStep(0);
      return;
    };
    this.wizard.goToPreviousStep();
  }

  onFinalStep(final: boolean, event: Event) {
    this.dialogRef.close(final);
  }
}
