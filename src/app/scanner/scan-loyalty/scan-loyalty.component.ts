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
  providers: [LoyaltyLocalService]
})
export class ScanLoyaltyComponent implements OnInit, OnDestroy {

  @ViewChild(SubDiscountFormComponent, { static: true })
  public discountForm: SubDiscountFormComponent;
  @ViewChild(WizardComponent, { static: true })
  public wizard: WizardComponent;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  submitted: boolean = false;
  submitForm: FormGroup;

  showEmailForm = false;
  showCardScanner = false;

  public user: LoyaltyLocalInterface["User"];
  public transaction: LoyaltyLocalInterface["PointsTransaction"];
  public action: LoyaltyLocalInterface["Actions"];


  state: string = '11';
  constructor(
    private cdRef: ChangeDetectorRef,
    private loyaltyService: LoyaltyService,
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.user.subscribe(user => this.user = user);
    this.loyaltyLocalService.pointsTransaction.subscribe(transaction => this.transaction = transaction);
    this.loyaltyLocalService.actions.subscribe(action => this.action = action);
    this.unsubscribe = new Subject();
  }
  // constructor(
  //   private router: Router,
  //   private loyaltyService: LoyaltyService,
  //   private authenticationService: AuthenticationService,
  //   private cdRef: ChangeDetectorRef,
  //   private fb: FormBuilder,
  //   private translate: TranslateService
  // ) {
  //   
  // }


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

  onSuccessScan(event: string) {
    this.loyaltyService.checkByIdentifier((this.user.identifier).toLowerCase())
      .pipe(
        tap(
          data => {
            if (data.message === 'user_not_exists') {
              this.state = '11';
              this.showEmailForm = true;
            } else if (data.message === 'user_no_email') {
              // User is registred No Email & Only Card - Ask Email
              this.state = '10';
              this.showEmailForm = true;
            } else if (data.message === 'user_no_card') {
              // User is registred Only Email & No Card - Go to Step 2
              this.state = '01';
              this.onNextStep();
            } else if (data.data) {
              // User is registred with Email & Card - Go to Step 2
              this.state = '00';
              this.onNextStep();
            }

            console.log(data);//this.balance = parseInt(data.points, 16);
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

    // State 00: All Good -> User Account has Email & Card Number - No action
    // State 01: Half Good -> User Account has Email but No Card Number - Nothing to Do
    // State 10: Half Good -> User Account has Card Number but No Email - Add email - Message About it.
    // State 11: No Good -> User Account has No Email & No Card Number - Add email - Message about it.
  }

  onSubmitEmailForm(event: string) {
    if (event) {
      this.loyaltyService.checkByEmail((this.user.email).toLowerCase())
        .pipe(
          tap(
            data => {
              if (data.msg === 'user_not_exists') {
                if (this.user.identifier && this.state === '11') {
                  this.action.need_full_registration = true;
                }
                else if (this.user.identifier && this.state === '10') {
                  this.action.need_email_update = true;
                }
                else {
                  this.action.need_email_registration = true;
                }
                this.loyaltyLocalService.changeActions(this.action);
                this.onNextStep();
              } else if (data.data) {
                if (this.user.identifier) {
                  this.action.need_card_update = true;
                  this.loyaltyLocalService.changeActions(this.action);
                }
                this.onNextStep();
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
    } else {
      if (this.user.identifier) {
        this.action.need_card_registration = true;
        this.loyaltyLocalService.changeActions(this.action);
        this.onNextStep();
      } else {
        console.log("Mail or Scan!");
      }
    }
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

  onNextStep() {
    console.log("On Next Step");
    this.wizard.goToNextStep();
  }

  onPreviousStep() {
    this.wizard.goToPreviousStep();
  }



  onShowEmailFormChange() {
    this.showEmailForm = !this.showEmailForm;
    //amountForm.initializeComponent();
  }

  initForm() {

  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
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
