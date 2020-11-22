import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Local Services & Interfaces
 */
import { LocalLoyaltyService } from '../_loyalty.service';
import { LocalLoyaltyInterface } from '../_loyalty.interface';

@Component({
  selector: 'app-sub-amount-form',
  templateUrl: './sub-amount-form.component.html',
  styleUrls: ['./sub-amount-form.component.scss']
})
export class SubAmountFormComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  add_amount: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Content Variables
   */
  public transaction: LocalLoyaltyInterface["Transaction"];

  /**
   * Form
   */
  stepperForm: FormGroup;
  submitted: boolean = false;

  private subscription: Subscription = new Subscription;

	/**
	 * Component Constructor
	 */
  constructor(
    private fb: FormBuilder,
    private stepperService: LocalLoyaltyService
  ) {
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
      amount: ['', Validators.compose([
        Validators.required,
      ])
      ]
    });
  }

  onNextStep() {
    const controls = this.stepperForm.controls;
    if (this.stepperForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    };

    this.transaction.amount = controls.amount.value;
    this.transaction.final_amount = controls.amount.value;
    this.stepperService.changeTransaction(this.transaction);
    this.add_amount.emit(controls.amount.value);
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
