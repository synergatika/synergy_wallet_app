import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Local Services & Interfaces
 */
import { LocalLoyaltyService } from '../_loyalty.service';
import { LocalLoyaltyInterface } from '../_loyalty.interface';

@Component({
  selector: 'app-sub-offer-form',
  templateUrl: './sub-offer-form.component.html',
  styleUrls: ['./sub-offer-form.component.scss']
})
export class SubOfferFormComponent implements OnInit, OnDestroy {

  /**
   * Event Emitter
   */
  @Output()
  add_offer: EventEmitter<number> = new EventEmitter<number>();
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
      quantity: [1, Validators.compose([
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.transaction.possible_quantity)(control)
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

    this.transaction.quantity = controls.quantity.value;
    this.transaction.discount_points = this.transaction.cost * this.transaction.quantity;
    this.stepperService.changeTransaction(this.transaction);
    this.add_offer.emit(controls.quantity.value);
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
