import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Local Services & Interfaces
 */
import { LocalMicrocreditService } from '../_microcredit.service';
import { LocalMicrocreditInterface } from '../_microcredit.interface';

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
  public campaign: LocalMicrocreditInterface["MicrocreditCampaign"];
  public transaction: LocalMicrocreditInterface["Transaction"];

  tempAmount: number;
  showAddStep: boolean = true;
  showSubStep: boolean = false;

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
    private stepperService: LocalMicrocreditService
  ) {
    this.subscription.add(this.stepperService.transaction.subscribe(transaction => this.transaction = transaction));
    this.subscription.add(this.stepperService.microcreditCampaign.subscribe(campaign => this.campaign = campaign));
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initializeForm();
  }

  /**
   * On Init
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeForm() {
    this.stepperForm = this.fb.group({
      amount: [0, Validators.compose([
        Validators.required,
        (control: AbstractControl) => Validators.min(this.campaign.minAllowed)(control),
        (control: AbstractControl) => Validators.max((this.campaign.maxAllowed) > 0 ? this.campaign.maxAllowed : this.campaign.maxAmount)(control)
      ])
      ],
      paid: [true, Validators.compose([
        Validators.required,
      ])
      ]
    });

    const controls = this.stepperForm.controls;
    controls['amount'].setValue(this.campaign.minAllowed);
  }

  onChangeAmount(action: boolean) {
    const controls = this.stepperForm.controls;
    this.tempAmount = (action) ? (controls.amount.value + this.campaign.stepAmount) : (controls.amount.value - this.campaign.stepAmount);

    this.showAddStep = (this.tempAmount >= this.campaign.maxAllowed) ? false : true;
    this.showSubStep = (this.tempAmount <= this.campaign.minAllowed) ? false : true;

    controls['amount'].setValue(this.tempAmount);
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
    this.transaction.paid = controls.paid.value;
    this.stepperService.changeTransaction(this.transaction);
    this.add_amount.emit(this.transaction.amount);
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
