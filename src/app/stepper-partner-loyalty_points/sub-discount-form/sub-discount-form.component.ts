import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Local Services & Interfaces
 */
import { LocalLoyaltyService } from '../_loyalty.service';
import { LocalLoyaltyInterface } from '../_loyalty.interface';

@Component({
  selector: 'app-sub-discount-form',
  templateUrl: './sub-discount-form.component.html',
  styleUrls: ['./sub-discount-form.component.scss']
})
export class SubDiscountFormComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  add_discount: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Content Variables
   */
  public user: LocalLoyaltyInterface["User"];
  public transaction: LocalLoyaltyInterface["Transaction"];
  public actions: LocalLoyaltyInterface["Actions"];

  /**
   * Form
   */
  stepperForm: FormGroup;
  submitted: boolean = false;

  conversionRatiο = 0.01;

  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 */
  constructor(
    private fb: FormBuilder,
    private stepperService: LocalLoyaltyService
  ) {
    this.subscription.add(this.stepperService.user.subscribe(user => this.user = user));
    this.subscription.add(this.stepperService.actions.subscribe(actions => this.actions = actions));
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.initializeForm();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeForm() {
    this.stepperForm = this.fb.group({
      final_amount: [{ value: this.transaction.final_amount, disabled: true }, Validators.compose([
        Validators.required,
      ])
      ],
      wantRedeem: [{ value: false, disabled: false }, Validators.compose([
        Validators.required
      ])
      ],
    });
  }

  initializeDiscount() {
    this.initializeForm();
    this.actions.redeem = '10';
  }

  // cannotRedeem() {
  //   this.initForm();
  //   const controls = this.submitForm.controls;
  //   controls["wantRedeem"].disable();
  //   this.actions.redeem = '00';
  // }

  onWantRedeemCheckboxChange() {
    const controls = this.stepperForm.controls;
    this.actions.redeem = '1' + ((controls.wantRedeem.value) ? '0' : '1');
    console.log(this.actions.redeem);
    if (this.actions.redeem === '11') {
      this.transaction.final_amount = this.transaction.amount - this.transaction.possible_discount_amount;
      this.transaction.discount_amount = this.transaction.possible_discount_amount;
      this.transaction.discount_points = this.transaction.possible_discount_amount * (1 / this.conversionRatiο);
    } else {
      this.transaction.final_amount = this.transaction.amount;
      this.transaction.discount_amount = 0;
      this.transaction.discount_points = 0;
    }
    controls['final_amount'].setValue(this.transaction.final_amount);
  }

  onNextStep() {
    const controls = this.stepperForm.controls;
    if (this.stepperForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.stepperService.changeActions(this.actions);
    this.stepperService.changeTransaction(this.transaction);

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
    const control = this.stepperForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
