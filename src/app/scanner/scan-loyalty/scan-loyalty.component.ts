import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { LoyaltyService } from '../../core/services/loyalty.service';

import { WizardComponent } from "angular-archwizard";
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { SubDiscountFormComponent } from "../sub-discount-form/sub-discount-form.component";
import { ScannerService } from "../_scanner.service";
import { ScannerInterface } from "../_scanner.interface";

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-scan-loyalty',
  templateUrl: './scan-loyalty.component.html',
  styleUrls: ['./scan-loyalty.component.scss'],
  // providers: [LoyaltyLocalService]
})
export class ScanLoyaltyComponent implements OnInit, OnDestroy {

  @ViewChild(SubDiscountFormComponent, { static: true })
  public discountForm: SubDiscountFormComponent;
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  showIdentifierForm: boolean = false;
  showEmailForm: boolean = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;
  private subscription: Subscription = new Subscription;

  public user: ScannerInterface["User"];
  public transaction: ScannerInterface["PointsTransaction"];
  public actions: ScannerInterface["Actions"];
  conversionRatiο = 0.01;

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private scannerNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService,
    private scannerService: ScannerService,
    public dialogRef: MatDialogRef<ScanLoyaltyComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subscription.add(this.scannerService.user.subscribe(user => this.user = user));
    this.subscription.add(this.scannerService.pointsTransaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.scannerService.actions.subscribe(actions => this.actions = actions));
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
    this.scannerNoticeService.setNotice(null);
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
    }
    this.scannerNoticeService.setNotice(message, type);
    console.log("on Check Identifier");
    console.log(action)
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
      default: type = 'danger'; message = 'Something Went Wrong'; break;
    }
    this.scannerNoticeService.setNotice(message, type);
    return action;
  }

  onSuccessScanIdentifier(event: string) {
    this.authenticationService.checkIdentifier((this.user.identifier_scan).toLowerCase())
      .pipe(
        tap(
          data => {
            this.actions.registration = '0' + this.checkRegistrationOnIdentifier(data.status);
            this.scannerService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.scannerNoticeService.setNotice(this.translate.instant(error), 'danger');
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
            this.scannerService.changeActions(this.actions);
          },
          error => {
            console.log(error);
            this.scannerNoticeService.setNotice(this.translate.instant(error), 'danger');
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
              this.actions.registration = this.checkRegistrationOnEmail(data.status) +
                this.actions.registration.substr(this.actions.registration.length - 4);
              console.log("Action on Email")
              console.log(this.actions.registration);
              this.scannerService.changeActions(this.actions);
            },
            error => {
              console.log(error);
              this.scannerNoticeService.setNotice(this.translate.instant(error), 'danger');
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
      this.scannerService.changeActions(this.actions);
      this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.NO_EMAIL_WILL_LINK'), 'warning');
      this.onNextStep();
    }
  }

  onSubmitAmountForm(event: number) {
    if ((this.actions.registration).length < 5) {
      this.actions.registration = 'xx' + this.actions.registration;
      this.scannerService.changeActions(this.actions);
    }
    this.actionsHandler();
  }

  actionsHandler() {
    const user = {
      identifier: this.user.identifier_scan || this.user.identifier_form,
      email: this.user.email
    };
    console.log("on ActionsHandler");
    console.log(this.actions.registration);
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
        this.fetchBalanceData();
        this.onNextStep();
        break;
      }
    }

    // => registration with card,
    // => registration with email,
    // => registration with email, card
    // => link a card
    // => link an email
  }

  fetchBalanceData() {
    // console.log("Action")
    // console.log(this.actions.registration);
    // let search_by = (['110100', '111100'].includes(this.actions.registration)) ?
    //   this.user.email : (this.user.identifier_scan || this.user.identifier_form);
    // console.log("Search By")
    // console.log(search_by);
    if (this.transaction.amount >= 5) {
      this.loyaltyService.readBalanceByPartner(((this.user.identifier_scan || this.user.identifier_form)).toLowerCase())
        .pipe(
          tap(
            data => {
              this.transaction.points = parseInt(data.points, 16);
              console.log(this.transaction.points);
              this.initializeDiscountAmount();
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
    } else {
      this.actions.redeem = '00';
      this.scannerService.changeActions(this.actions);
      this.transaction.discount_amount = 0;
      this.scannerService.changePointsTransaction(this.transaction);
      this.earnPoints(this.user.identifier_form || this.user.identifier_scan);
      this.onAfterNextStep(4);
    }
  }

  slipFloor(num: number) {
    let f = Math.floor(num);
    if (num - f < 0.5) {
      return f;
    }
    return f + 0.5;
  }

  initializeDiscountAmount() {
    const maxAllowedDiscount: number = this.transaction.amount * 0.2;
    const maxPossibleDiscount: number = this.transaction.points * this.conversionRatiο;
    if (maxPossibleDiscount > maxAllowedDiscount) {
      console.log("1");
      this.transaction.discount_amount = this.slipFloor(maxAllowedDiscount);
      this.transaction.discount_points = this.transaction.discount_amount * (1 / this.conversionRatiο);
      this.scannerService.changePointsTransaction(this.transaction);
      this.discountForm.initializeDiscount();
      //  this.onNextStep();
    } else if (maxPossibleDiscount < 1) {
      console.log("2");
      this.actions.redeem = '00';
      this.scannerService.changeActions(this.actions);
      this.transaction.discount_amount = 0;
      this.scannerService.changePointsTransaction(this.transaction);
      this.earnPoints(this.user.identifier_form || this.user.identifier_scan);
      this.onAfterNextStep(4);
    } else {
      console.log("3");
      this.transaction.discount_amount = this.slipFloor(maxPossibleDiscount);
      this.transaction.discount_points = this.transaction.discount_amount * (1 / this.conversionRatiο);
      this.scannerService.changePointsTransaction(this.transaction);
      this.discountForm.initializeDiscount();
      //  this.onNextStep();
    }
  }

  onSubmitDiscountForm(event: boolean) {

    console.log('Actions');
    console.log("Registration: " + this.actions.registration);
    console.log("Redeem: " + this.actions.redeem);

    this.earnPoints(this.user.identifier_form || this.user.identifier_scan);
    this.onNextStep();
  }

  actionRegistration(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Reg', email + card)
    this.authenticationService.register_member(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.fetchBalanceData();
          },
          error => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_REGISTRATION') + '<br>' +
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

  actionLinkCard(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Card', email + card)
    this.authenticationService.linkCard(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.fetchBalanceData();
          },
          error => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_CARD') + '<br>' +
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

  actionLinkEmail(notice: { type: string, message: string }, email: string, card: string) {
    console.log('Email', email + card);
    this.authenticationService.linkEmail(email, card)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.fetchBalanceData();
            //  this.earnPoints(card);
          },
          error => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.ERROR_LINK_EMAIL') + '<br>' +
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

  earnPoints(_to: string) {

    let earnPoints = {
      password: 'all_ok',
      _to: _to,
      _amount: this.transaction.final_amount
    };

    this.loyaltyService.earnPoints(earnPoints._to, earnPoints.password, earnPoints._amount)
      .pipe(
        tap(
          data => {
            console.log(data);
            if (this.actions.redeem === '11') {
              console.log("Will Redeem");
              this.redeemPoints(_to);
            } else {
              console.log("Will Not Redeem");
              this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
              this.onNextStep();
            }
          },
          error => {
            console.log(error)
            this.scannerNoticeService.setNotice(
              this.translate.instant('WIZARD_MESSAGES.ERROR_EARN_POINTS') + '<br>' +
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

  redeemPoints(_to: string) {

    let redeemPoints = {
      password: 'all_ok',
      _to: _to,
      _points: this.transaction.discount_points
    }
    console.log(this.transaction)
    this.loyaltyService.redeemPoints(redeemPoints._to, redeemPoints.password, redeemPoints._points)
      .pipe(
        tap(
          data => {
            this.scannerNoticeService.setNotice(this.translate.instant('WIZARD_MESSAGES.SUCCESS_TRANSACTION'), 'success');
            this.onNextStep();
          },
          error => {
            this.scannerNoticeService.setNotice(
              this.translate.instant('WIZARD_MESSAGES.ERROR_REDEEM_POINTS') + '<br>' +
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

  onAfterNextStep(step: number) {
    this.wizard.goToStep(step);
  }

  onPreviousStep(event: boolean) {
    this.scannerNoticeService.setNotice(null);
    if (this.wizard.currentStep.stepTitle === 'Amount' && !this.showEmailForm) {
      this.onAfterNextStep(0);
      return;
    };
    this.wizard.goToPreviousStep();
  }

  onFinalStep(event: boolean) {
    this.dialogRef.close();
  }
}






  // onSuccessScanIdentifier(event: string) {

  //   let action: string = '';

  //   // 'a': 'Identifier OR Form',
  //   // 'b': 'Was Email OR Card',
  //   // 'c': Is Email Registered,
  //   // 'd': Is Card Registered,

  //   this.loyaltyService.checkIdentifier((this.user.identifier_scan).toLowerCase())
  //     .pipe(
  //       tap(
  //         data => {
  //           if (data.status === 'email_both') {
  //             // Ok!
  //             action = 'xx0011'; // No action
  //             this.onAfterNextStep(3);
  //           } else if (data.status === 'email_none') {
  //             action = 'xx0000'; // Cannot Be Happened!
  //           } else if (data.status === 'email_no_card') {
  //             // Ok! Maybe ask card???
  //             action = 'xx0010'; // No action
  //             this.onAfterNextStep(3);
  //           } else if (data.status === 'card_both') {
  //             action = 'xx0111'; // No action
  //             this.onAfterNextStep(3);
  //           } else if (data.status === 'card_none') {
  //             action = 'xx0100'; // OR action = '0100' // Full Registration OR Link Card
  //             this.messages.stepB = 'New Card. If user is regitered enter email to link! If not ask email to register! Or procced and create a card account';
  //             this.onNextStep();
  //           } else if (data.status === 'card_no_email') {
  //             action = 'xx0101'; // OR action = '0000' // Link Email OR No Action
  //             this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
  //             this.onNextStep();
  //           } else {
  //             // Cannot Be Happened!
  //           }
  //           this.actions.registration = action;
  //           this.scannerService.changeActions(this.actions);
  //         },
  //         error => {
  //           console.log(error);
  //         }),
  //       takeUntil(this.unsubscribe),
  //       finalize(() => {
  //         this.loading = false;
  //         this.cdRef.markForCheck();
  //       })
  //     )
  //     .subscribe();
  // }

  // onSubmitIdentifierForm(event: string) {

  //   let action: string = '0000';

  //   // 'a': 'Identifier OR Form',
  //   // 'b': 'Was Email OR Card',
  //   // 'c': Is Email Registered,
  //   // 'd': Is Card Registered,

  //   this.loyaltyService.checkIdentifier((this.user.identifier_form).toLowerCase())
  //     .pipe(
  //       tap(
  //         data => {

  //           if (data.status === 'email_both') {
  //             action = 'xx1011'; // No action
  //             this.onAfterNextStep(2);
  //           } else if (data.status === 'email_none') {
  //             action = 'xx1000'; // Need Registration
  //             this.messages.stepC = 'User would be created';
  //             this.onAfterNextStep(2);
  //           } else if (data.status === 'email_no_card') {
  //             action = 'xx1010'; // No Action
  //             this.onAfterNextStep(2);
  //           } else if (data.status === 'card_both') {
  //             action = 'xx1111'; // No Action
  //             this.onAfterNextStep(2);
  //           } else if (data.status === 'card_none') {
  //             this.messages.stepB = '<span class="message-highlight"><span class="mdi mdi-account-card-details"></span> New Card</span><br>If user is registered enter email to link! If not, ask email to register!<br>Or procced and create a card account';
  //             action = 'xx1100'; // OR action = '0101' // Full Registration OR Link Card
  //             this.onNextStep();
  //           } else if (data.status === 'card_no_email') {
  //             // Πληκτρολόγησε την κάρτα, Ζήτα Email
  //             action = 'xx1101'; // OR action = '0000' // Link Email OR No Action
  //             this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
  //             this.onNextStep();
  //           } else {
  //             // Cannot Be Happened!
  //           }
  //           this.actions.registration = action;
  //           console.log("Action on Identifier")
  //           console.log(this.actions.registration);
  //           this.scannerService.changeActions(this.actions);
  //         },
  //         error => {
  //           console.log(error);
  //         }),
  //       takeUntil(this.unsubscribe),
  //       finalize(() => {
  //         this.loading = false;
  //         this.cdRef.markForCheck();
  //       })
  //     )
  //     .subscribe();
  // }

  // onSubmitEmailForm(event) {
  //   let action: string = '00';

  //   // 'a': Form has Email
  //   // 'b': Mail Exist?

  //   // έρχεται εδώ όταν
  //   // υπαρχουσα καρτα δεν έχει email
  //   // νέα καρτα
  //   if (event) {
  //     this.loyaltyService.checkIdentifier((this.user.email).toLowerCase())
  //       .pipe(
  //         tap(
  //           data => {
  //             console.log("On Email Message")
  //             console.log(data.status);
  //             if (data.status === 'email_both') {
  //               this.messages.stepC = 'Your Email Has already a card. If you continue the card will be replaced';
  //               action = '11' + this.actions.registration.substr(2, 4);

  //             } else if (data.status === 'email_none') {
  //               this.messages.stepC = 'Your Email Will Link With Card';
  //               action = '10' + this.actions.registration.substr(2, 4);
  //               console.log("2")
  //             } else if (data.status === 'email_no_card') {
  //               this.messages.stepC = 'Card Will Link With Your Email';
  //               action = '11' + this.actions.registration.substr(2, 4);
  //               console.log("3")
  //             } else {
  //               console.log("4")
  //               // Cannot Be Happened!
  //             }
  //             this.actions.registration = action;
  //             console.log("Action on Email")
  //             console.log(this.actions.registration);
  //             this.scannerService.changeActions(this.actions);
  //           },
  //           error => {
  //             console.log(error);
  //           }),
  //         takeUntil(this.unsubscribe),
  //         finalize(() => {
  //           this.loading = false;
  //           this.cdRef.markForCheck();
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     action = '00' + this.actions.registration.substr(2, 4);
  //     this.actions.registration = action;
  //     this.scannerService.changeActions(this.actions);
  //   }
  //   console.log("Action on Email")
  //   console.log(this.actions.registration);
  //   this.onNextStep();
  // }


  // actionsHandler() {
  //   const user = {
  //     identifier: this.user.identifier_scan || this.user.identifier_form,
  //     email: this.user.email
  //   };

  //   let authData = {
  //     email: '',
  //     card: ''
  //   };
  //   // 'a': Form has Email
  //   // 'b': Mail Exist?
  //   // 'a': 'Identifier OR Form',
  //   // 'b': 'Was Email OR Card',
  //   // 'c': Is Email Registered,
  //   // 'd': Is Card Registered,

  //   // All States!!!
  //   // xx0011, xx0000, xx0010, xx0111,
  //   // 100100, 110100, 000100 // New Card
  //   // 100101, 110101, 000101 // Card No Email
  //   // xx1011, xx1000, xx1010, xx1111,
  //   // 101100, 111100, 001100 // New Card
  //   // 101101, 111101, 001101 // Card No Email

  //   console.log("Code: ");
  //   console.log(this.actions.registration);


  //   const states = {
  //     do_nothing: {
  //       has_both: ['xx0011', 'xx1011', 'xx0111', 'xx1111'],
  //       do_not_want_to_link_email: ['000101', '001101'],
  //       could_link_card: ['xx0010', 'xx1010'],
  //     },
  //     registration: {
  //       only_email: ['xx0000', 'xx1000'],
  //       only_card: ['000100', '001100'],
  //       email_card: ['100100', '101100'],
  //       need_merge: ['110101', '111101'] // This is a merge situation!!!
  //     },
  //     link: {
  //       email: ['100101', '101101'],
  //       card: ['110100', '111100']
  //     }
  //   }

  //   if (Array.prototype.concat.apply([],
  //     [states.registration.only_email, states.registration.only_card, states.registration.email_card])
  //     .includes(this.actions.registration)) {
  //     console.log('Action: Registration');
  //     if ((states.registration.only_email).includes(this.actions.registration)) {
  //       console.log('A');
  //       authData.email = user.identifier;
  //     } else if ([...states.registration.only_card, ...states.registration.email_card].includes(this.actions.registration)) {
  //       console.log('B');
  //       authData.email = user.email;
  //       authData.card = user.identifier;
  //     }

  //     this.authenticationService.register_member(authData.email, authData.card)
  //       .pipe(
  //         tap(
  //           data => {
  //             this.earnPoints(authData.email || authData.card);
  //           },
  //           error => {
  //             console.log(error);
  //           }),
  //         takeUntil(this.unsubscribe),
  //         finalize(() => {
  //           this.loading = false;
  //           this.cdRef.markForCheck();
  //         })
  //       )
  //       .subscribe();

  //   } else if ((states.link.card).includes(this.actions.registration)) {

  //     authData.email = user.email;
  //     authData.card = user.identifier;
  //     console.log('Action: Link A Card');

  //     this.loyaltyService.linkCard(authData.email, authData.card)
  //       .pipe(
  //         tap(
  //           data => {
  //             this.earnPoints(authData.email);
  //           },
  //           error => {
  //             console.log(error);
  //           }),
  //         takeUntil(this.unsubscribe),
  //         finalize(() => {
  //           this.loading = false;
  //           this.cdRef.markForCheck();
  //         })
  //       )
  //       .subscribe();
  //   } else if ((states.link.email).includes(this.actions.registration)) {
  //     authData.email = user.email;
  //     authData.card = user.identifier;
  //     console.log('Action: Link An Email');

  //     this.loyaltyService.linkEmail(authData.email, authData.card)
  //       .pipe(
  //         tap(
  //           data => {
  //             this.earnPoints(authData.card);
  //           },
  //           error => {
  //             console.log(error);
  //           }),
  //         takeUntil(this.unsubscribe),
  //         finalize(() => {
  //           this.loading = false;
  //           this.cdRef.markForCheck();
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     this.earnPoints(user.identifier);
  //   }
  // }