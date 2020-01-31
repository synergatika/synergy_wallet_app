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

  state: string = '11';
  constructor(
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
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

    this.loyaltyService.checkIdentifier((this.user.identifier_scan).toLowerCase())
      .pipe(
        tap(
          data => {
            if (data.message === 'email_both') {
              // Ok!
              this.state = '011';
              this.onAfterNextStep(3);
            } else if (data.message === 'email_none') {
              this.state = '000';
              // Cannot Be Happened!
            } else if (data.message === 'email_no_card') {
              // Ok! Maybe ask card???
              this.state = '001';
              this.onAfterNextStep(3);
            } else if (data.message === 'card_both') {
              this.state = '111';
              this.onAfterNextStep(3);
            } else if (data.message === 'card_none') {
              this.state = '100';
              this.messages.stepB = 'New Card. If user is regitered enter email to link! If not ask email to register! Or procced and create a card account';
              this.onNextStep();
            } else if (data.message === 'card_no_email') {
              this.state = '101';
              this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
              this.onNextStep();
            } else {
              // Cannot Be Happened!
            }
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

    this.loyaltyService.checkIdentifier((this.user.identifier_form).toLowerCase())
      .pipe(
        tap(
          data => {
            if (data.message === 'email_both') {
              // Είχε ξαχάσει κάρτα κινητό οπότε προχωράμε
              this.state = '011';
              this.onAfterNextStep(2);
            } else if (data.message === 'email_none') {
              // Θα χρειαστεί εγγραφή
              this.messages.stepC = 'User would be created';
              this.state = '000';
              this.user.email = this.user.identifier_form;
              this.loyaltyLocalService.changeUser(this.user);
              this.onAfterNextStep(2);
            } else if (data.message === 'email_no_card') {
              // Ok! Maybe ask card???
              this.state = '001';
              this.onAfterNextStep(2);
            } else if (data.message === 'card_both') {
              // Μπήκε με αριθμό κάρτας
              this.state = '111';
              this.onAfterNextStep(2);
            } else if (data.message === 'card_none') {
              // Πληκτρολόγησε Νέα Κάρτα
              this.messages.stepB = 'New Card. If user is regitered enter email to link! If not ask email to register! Or procced and create a card account';
              this.state = '100';
              this.onNextStep();
            } else if (data.message === 'card_no_email') {
              // Πληκτρολόγησε την κάρτα, Ζήτα Email
              this.state = '101';
              this.messages.stepB = 'Existing Card. ! Ask email to link! Or procced!';
              this.onNextStep();
            } else {
              // Cannot Be Happened!
            }
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
    console.log(event);
    this.loyaltyService.checkIdentifier((this.user.email).toLowerCase())
      .pipe(
        tap(
          data => {
            // Βάζει το email. Oι απαντήσεις εδώ είναι 2:
            // α) υπάρχων χρήστης -> update card Number,
            // b) νέος χρήστης -> register

            // ή δεν βάζει email άρα συνεχίζουμε με την κάρτα ως έχει!
            if (data.message === 'email_both') {
              // Είχε ξαχάσει κάρτα κινητό οπότε προχωράμε
              this.state = '011';
              this.onNextStep();
            } else if (data.message === 'email_none') {
              this.messages.stepC = 'User would be created';
              this.state = '000';
              this.user.email = this.user.identifier_form;
              this.loyaltyLocalService.changeUser(this.user);
              this.onNextStep();
            } else if (data.message === 'email_no_card') {
              // Ok! Maybe ask card???
              this.messages.stepC = 'Link Done';
              this.state = '001';
              this.onNextStep();
            } else {
              // Cannot Be Happened!
            }
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

  onSubmitAmountForm(event: number) {
    this.discountForm.fetchBalanceData();
    this.onNextStep();
  }

  onSubmitDiscountForm(event: any) {
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

    //this.earnPoints(earnPoints, redeemPoints);
    this.onNextStep();
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
