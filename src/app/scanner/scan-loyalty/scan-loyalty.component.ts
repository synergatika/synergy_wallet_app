import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { LoyaltyService } from '../../core/services/loyalty.service';

import { WizardComponent } from "angular-archwizard";
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SubDiscountFormComponent } from "../sub-discount-form/sub-discount-form.component";
import { LoyaltyLocalService } from "../loyaltyLocal.service";
import { LoyaltyLocalInterface } from "../loyaltyLocal.interface";

@Component({
  selector: 'app-scan-loyalty',
  templateUrl: './scan-loyalty.component.html',
  styleUrls: ['./scan-loyalty.component.sass'],
  // providers: [LoyaltyLocalService]
})
export class ScanLoyaltyComponent implements OnInit, OnDestroy {

  @ViewChild(SubDiscountFormComponent, { static: true })
  public discountForm: SubDiscountFormComponent;
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  // submitted: boolean = false;
  // submitForm: FormGroup;

  showIdentifierForm = false;
  showCardScanner = false;

  public user: LoyaltyLocalInterface["User"];
  public transaction: LoyaltyLocalInterface["PointsTransaction"];
  public action: LoyaltyLocalInterface["Actions"];

  messages = {
    stepB: '',
    stepC: ''
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService,
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.user.subscribe(user => this.user = user);
    this.loyaltyLocalService.pointsTransaction.subscribe(transaction => this.transaction = transaction);
    this.loyaltyLocalService.actions.subscribe(action => this.action = action);
    this.unsubscribe = new Subject();
  }

	/**
	 * On init
	 */
  ngOnInit() {
    this.initForm();
  }

	/**
	 * On destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * States: 
   * no_identifier_field: 0,
   * identifier_field: 1
   * 
   * no_email_field: 0,
   * email_field: 1
   * 
   * CheckIdentifier:
   * user_not_exists_A: 11.
   * user_no_email_A: 10,
   * user_no_card_A: 01,
   * user_exists_A: 00
   * 
   * CheckEmail:
   * user_not_exists_B: 0,
   * user_exists_B: 1
   */

  onSuccessScanIdentifier(event: string) {

    let action: string = '';

    // 'a': 'Identifier OR Form',
    // 'b': 'Was Email OR Card',
    // 'c': Is Email Registered,
    // 'd': Is Card Registered,

    this.loyaltyService.checkIdentifier((this.user.identifier_scan).toLowerCase())
      .pipe(
        tap(
          data => {
            if (data.message === 'email_both') {
              // Ok!
              action = 'xx0011'; // No action
              this.onAfterNextStep(3);
            } else if (data.message === 'email_none') {
              action = 'xx0000'; // Cannot Be Happened!
            } else if (data.message === 'email_no_card') {
              // Ok! Maybe ask card???
              action = 'xx0010'; // No action
              this.onAfterNextStep(3);
            } else if (data.message === 'card_both') {
              action = 'xx0111'; // No action
              this.onAfterNextStep(3);
            } else if (data.message === 'card_none') {
              action = 'xx0100'; // OR action = '0100' // Full Registration OR Link Card
              this.messages.stepB = 'New Card. If user is regitered enter email to link! If not ask email to register! Or procced and create a card account';
              this.onNextStep();
            } else if (data.message === 'card_no_email') {
              action = 'xx0101'; // OR action = '0000' // Link Email OR No Action
              this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
              this.onNextStep();
            } else {
              // Cannot Be Happened!
            }
            this.action.registration = action;
            this.loyaltyLocalService.changeActions(this.action);
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

  onSubmitIdentifierForm(event: string) {

    let action: string = '0000';

    // 'a': 'Identifier OR Form',
    // 'b': 'Was Email OR Card',
    // 'c': Is Email Registered,
    // 'd': Is Card Registered,

    this.loyaltyService.checkIdentifier((this.user.identifier_form).toLowerCase())
      .pipe(
        tap(
          data => {

            if (data.message === 'email_both') {
              action = 'xx1011'; // No action
              this.onAfterNextStep(2);
            } else if (data.message === 'email_none') {
              action = 'xx1000'; // Need Registration
              this.messages.stepC = 'User would be created';
              this.onAfterNextStep(2);
            } else if (data.message === 'email_no_card') {
              action = 'xx1010'; // No Action
              this.onAfterNextStep(2);
            } else if (data.message === 'card_both') {
              action = 'xx1111'; // No Action
              this.onAfterNextStep(2);
            } else if (data.message === 'card_none') {
              this.messages.stepB = 'New Card. If user is regitered enter email to link! If not ask email to register! Or procced and create a card account';
              action = 'xx1100'; // OR action = '0101' // Full Registration OR Link Card
              this.onNextStep();
            } else if (data.message === 'card_no_email') {
              // Πληκτρολόγησε την κάρτα, Ζήτα Email
              action = 'xx1101'; // OR action = '0000' // Link Email OR No Action
              this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
              this.onNextStep();
            } else {
              // Cannot Be Happened!
            }
            this.action.registration = action;
            this.loyaltyLocalService.changeActions(this.action);
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

  onSubmitEmailForm(event) {
    let action: string = '00';

    // 'a': Form has Email
    // 'b': Mail Exist?

    // έρχεται εδώ όταν
    // υπαρχουσα καρτα δεν έχει email
    // νέα καρτα
    if (event) {
      this.loyaltyService.checkIdentifier((this.user.email).toLowerCase())
        .pipe(
          tap(
            data => {
              if (data.message === 'email_both') {
              } else if (data.message === 'email_none') {
                this.messages.stepC = 'User would be created';
                action = '10' + this.action.registration.substr(2.4);
              } else if (data.message === 'email_no_card') {
                this.messages.stepC = 'Link Done';
                action = '11' + this.action.registration.substr(2.4);
              } else {
                // Cannot Be Happened!
              }
              this.action.registration = action;
              this.loyaltyLocalService.changeActions(this.action);
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
      action = '00' + this.action.registration.substr(2.4);
      this.action.registration = action;
      this.loyaltyLocalService.changeActions(this.action);
    }
    this.onNextStep();
  }

  onSubmitAmountForm(event: number) {
    this.discountForm.fetchBalanceData();
    this.onNextStep();
  }

  onSubmitDiscountForm(event: any) {

    console.log('Actions');
    console.log("Registration: " + this.action.registration);
    console.log("Redeem: " + this.action.redeem);

    const earnPoints = {
      _to: '',
      _amount: event.final_amount,
      password: 'all_ok'
    };
    const redeemPoints = {
      _to: '',
      _points: event.points,
      password: 'all_ok'
    }
    const user = {
      identifier: this.user.identifier_scan || this.user.identifier_form,
      email: this.user.email
    }

    this.actionsHandler(earnPoints, redeemPoints, user);
    //this.onNextStep();
  }

  onAfterNextStep(step: number) {
    this.wizard.goToStep(step);
  }

  onNextStep() {
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.wizard.goToPreviousStep();
  }

  onShowIdentifierFormChange() {
    this.showIdentifierForm = !this.showIdentifierForm;
  }

  initForm() {

  }

  actionsHandler(earnPoints, redeemPoints, user) {
    let authData = {
      email: '',
      card: ''
    };
    // 'a': Form has Email
    // 'b': Mail Exist?
    // 'a': 'Identifier OR Form',
    // 'b': 'Was Email OR Card',
    // 'c': Is Email Registered,
    // 'd': Is Card Registered,

    // All States!!!
    // xx0011, xx0000, xx0010, xx0111, 
    // 100100, 110100, 000100 // New Card
    // 100101, 110101, 000101 // Card No Email
    // xx1011, xx1000, xx1010, xx1111, 
    // 101100, 111100, 001100 // New Card
    // 101101, 111101, 001101 // Card No Email

    console.log("Code: ");
    console.log(this.action.registration);

    const registrationStates = ['xx0000', 'xx1000', '100100', '000100', '101100', '001100'];
    const linkCardStates = ['110100', '111100'];
    const linkEmailStates = ['110101', '111101', '100101', '101101'];

    if (registrationStates.includes(this.action.registration)) {
      console.log('Action: Registration');
      if (registrationStates.splice(0, 2).includes(this.action.registration)) {
        console.log('A');

        authData.email = user.identifier;
      } else if (registrationStates.splice(2, 4).includes(this.action.registration)) {
        console.log('B');
        authData.email = user.email;
        authData.card = user.identifier;
      }

      this.authenticationService.register_customer(authData.email, authData.card)
        .pipe(
          tap(
            data => {

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

    } else if (linkCardStates.includes(this.action.registration)) {

      authData.email = user.email;
      authData.card = user.identifier;
      console.log('Action: Link A Card');

      this.loyaltyService.linkCard(authData.email, authData.card)
        .pipe(
          tap(
            data => {

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
    } else if (linkEmailStates.includes(this.action.registration)) {
      authData.email = user.email;
      authData.card = user.identifier;
      console.log('Action: Link An Email');

      this.loyaltyService.linkEmail(authData.email, authData.card)
        .pipe(
          tap(
            data => {

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
  }

  earnPoints(earnPoints, redeemPoints) {
    console.log(earnPoints);
    console.log(redeemPoints);
    // this.loyaltyService.earnPoints(earnPoints._to, earnPoints._amount, earnPoints.password)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       if (wantRedeem) {
    //         this.redeemPoints(earnPoints, redeemPoints);
    //       } else {
    //         Swal.fire(
    //           this.translate.instant('MESSAGE.SUCCESS.TITLE'),
    //           this.translate.instant('MESSAGE.SUCCESS.AMOUNT') + (earnPoints._amount).toFixed(2) + ' || ' + this.translate.instant('MESSAGE.SUCCESS.POINTS') + '0',
    //           'success'
    //         );
    //       }
    //     },
    //     error => {
    //       console.log(error);
    //       Swal.fire(
    //         this.translate.instant('MESSAGE.ERROR.TITLE'),
    //         this.translate.instant('MESSAGE.ERROR.SERVER'),
    //         'error'
    //       );
    //     });
  }

  redeemPoints(earnPoints, redeemPoints) {
    // this.loyaltyService.redeemPoints(redeemPoints._to, redeemPoints._points, redeemPoints.password)
    //   .pipe(first())
    //   .subscribe(
    //     data => {
    //       Swal.fire(
    //         this.translate.instant('MESSAGE.SUCCESS.TITLE'),
    //         this.translate.instant('MESSAGE.SUCCESS.AMOUNT') + (earnPoints._amount).toFixed(2) + ' || ' + this.translate.instant('MESSAGE.SUCCESS.POINTS') + (redeemPoints._points).toFixed(2),
    //         'success'
    //       );
    //     },
    //     error => {
    //       console.log(error);
    //       Swal.fire(
    //         this.translate.instant('MESSAGE.ERROR.TITLE'),
    //         this.translate.instant('MESSAGE.ERROR.SERVER'),
    //         'error'
    //       );
    //     })
  }

  finalize() {

  }
}
