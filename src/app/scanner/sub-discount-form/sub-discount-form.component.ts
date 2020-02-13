import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

import { LoyaltyService } from '../../core/services/loyalty.service';
import { LoyaltyLocalService } from '../loyaltyLocal.service';
import { LoyaltyLocalInterface } from '../loyaltyLocal.interface';

@Component({
  selector: 'app-sub-discount-form',
  templateUrl: './sub-discount-form.component.html',
  styleUrls: ['./sub-discount-form.component.sass']
})
export class SubDiscountFormComponent implements OnInit, OnDestroy {

  @Output()
  add_discount: EventEmitter<object> = new EventEmitter<object>();

  user: LoyaltyLocalInterface["User"];
  transaction: LoyaltyLocalInterface["PointsTransaction"];
  actions: LoyaltyLocalInterface["Actions"];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  conversionRatiο = 100;

  submitted: boolean = false;
  submitForm: FormGroup;

  constructor(
    private loyaltyService: LoyaltyService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.user.subscribe(user => this.user = user)
    this.loyaltyLocalService.pointsTransaction.subscribe(transaction => this.transaction = transaction)
    this.loyaltyLocalService.actions.subscribe(actions => this.actions = actions)
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initForm();
  }

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

    if (this.transaction.amount >= 5) {
      this.loyaltyService.memberBalance((this.user.identifier || this.user.email).toLowerCase())
        .pipe(
          tap(
            data => {
              this.transaction.points = parseInt(data.data.points, 16);
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
    this.actions.want_redeem = true;
    this.actions.can_redeem = true;
  }

  cannotRedeem() {
    const controls = this.submitForm.controls;
    controls["wantRedeem"].disable();
    this.actions.want_redeem = false;
    this.actions.can_redeem = false;
  }

  onWantRedeemCheckboxChange() {
    const controls = this.submitForm.controls;
    this.actions.want_redeem = controls.wantRedeem.value;
    console.log(this.actions.want_redeem);
    if (!this.actions.want_redeem) {
      this.transaction.final_amount = this.transaction.amount - this.transaction.discount_amount;
    } else {
      this.transaction.final_amount = this.transaction.amount;
    }
    controls['final_amount'].setValue(this.transaction.final_amount);
  }

  onNextStep() {
    if (this.submitted) return;
    this.submitted = true;

    const controls = this.submitForm.controls;
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.loyaltyLocalService.changeActions(this.actions);
    this.loyaltyLocalService.changePointsTransaction(this.transaction);

    this.add_discount.emit({
      final_amount: this.transaction.final_amount,
      points: (this.actions.want_redeem) ? this.transaction.discount_amount * this.conversionRatiο : 0
    });
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
