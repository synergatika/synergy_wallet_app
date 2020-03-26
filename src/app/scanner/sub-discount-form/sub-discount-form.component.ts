import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

import { LoyaltyService } from '../../core/services/loyalty.service';
import { ScannerService } from '../_scanner.service';
import { ScannerInterface } from '../_scanner.interface';

@Component({
  selector: 'app-sub-discount-form',
  templateUrl: './sub-discount-form.component.html',
  styleUrls: ['./sub-discount-form.component.sass']
})
export class SubDiscountFormComponent implements OnInit, OnDestroy {

  @Output()
  add_discount: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  public user: ScannerInterface["User"];
  public transaction: ScannerInterface["PointsTransaction"];
  public actions: ScannerInterface["Actions"];

  submitted: boolean = false;
  submitForm: FormGroup;
  conversionRatiο = 0.01;

  constructor(
    private loyaltyService: LoyaltyService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private scannerService: ScannerService
  ) {
    this.scannerService.user.subscribe(user => this.user = user)
    this.scannerService.pointsTransaction.subscribe(transaction => this.transaction = transaction)
    this.scannerService.actions.subscribe(actions => this.actions = actions)
    this.unsubscribe = new Subject();
  }

	/**
	 * On Init
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

  initForm() {
    this.submitForm = this.fb.group({
      final_amount: [{ value: this.transaction.final_amount, disabled: true }, Validators.compose([
        Validators.required,
      ])
      ],
      wantRedeem: [{ value: false, disabled: true }, Validators.compose([
        Validators.required
      ])
      ],
    });
  }

  fetchBalanceData() {
    this.initForm();
    // console.log("Action")
    // console.log(this.actions.registration);
    // let search_by = (['110100', '111100'].includes(this.actions.registration)) ?
    //   this.user.email : (this.user.identifier_scan || this.user.identifier_form);
    // console.log("Search By")
    // console.log(search_by);
    if (this.transaction.amount >= 5) {
      this.loyaltyService.readBalanceByMerchant(((this.user.identifier_scan || this.user.identifier_form)).toLowerCase())
        .pipe(
          tap(
            data => {
              this.transaction.points = parseInt(data.points, 16);
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

    }
  }

  initializeDiscountAmount() {
    console.log(this.transaction.points);
    const maxAllowedDiscount: number = this.transaction.amount * 0.2;
    const maxPossibleDiscount: number = this.transaction.points * this.conversionRatiο;
    if (maxPossibleDiscount > maxAllowedDiscount) {
      this.transaction.discount_amount = maxAllowedDiscount;
      this.canRedeem();
    } else if (maxPossibleDiscount < 1) {
      this.transaction.discount_amount = 0;
      this.cannotRedeem();
    } else {
      this.transaction.discount_amount = maxPossibleDiscount;
      this.canRedeem();
    }
  }

  canRedeem() {
    const controls = this.submitForm.controls;
    controls["wantRedeem"].enable();
    this.actions.redeem = '10';
  }

  cannotRedeem() {
    const controls = this.submitForm.controls;
    controls["wantRedeem"].disable();
    this.actions.redeem = '00';
  }

  onWantRedeemCheckboxChange() {
    const controls = this.submitForm.controls;
    this.actions.redeem = '1' + ((controls.wantRedeem.value) ? '0' : '1');
    console.log(this.actions.redeem);
    if (this.actions.redeem === '11') {
      this.transaction.final_amount = this.transaction.amount - this.transaction.discount_amount;
    } else {
      this.transaction.final_amount = this.transaction.amount;
    }
    controls['final_amount'].setValue(this.transaction.final_amount);
  }

  onNextStep() {
    // if (this.submitted) return;
    // this.submitted = true;

    const controls = this.submitForm.controls;
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.scannerService.changeActions(this.actions);
    this.scannerService.changePointsTransaction(this.transaction);

    this.add_discount.emit(controls.wantRedeem.value);
  }

  onPreviousStep() {
    this.previous_step.emit(true);
  }

  /**
   * Checking control validation
   *
   * @param controlName: string => Equals to formControlName
   * @param validationType: string => Equals to valitors name
   */
  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.submitForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
