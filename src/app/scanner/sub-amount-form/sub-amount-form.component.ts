import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { LoyaltyLocalService } from '../loyaltyLocal.service';
import { LoyaltyLocalInterface } from '../loyaltyLocal.interface';

@Component({
  selector: 'app-sub-amount-form',
  templateUrl: './sub-amount-form.component.html',
  styleUrls: ['./sub-amount-form.component.sass']
})
export class SubAmountFormComponent implements OnInit {

  @Output()
  add_amount: EventEmitter<number> = new EventEmitter<number>();

  transaction: LoyaltyLocalInterface["PointsTransaction"];

  submitted: boolean = false;
  submitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.pointsTransaction.subscribe(transaction => this.transaction = transaction)
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
      amount: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
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

    this.transaction.amount = controls.amount.value;
    this.transaction.final_amount = controls.amount.value;
    this.loyaltyLocalService.changePointsTransaction(this.transaction);
    this.add_amount.emit(controls.amount.value);
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
