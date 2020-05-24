import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SupportService } from '../_support.service';
import { SupportInterface } from '../_support.interface';

@Component({
  selector: 'app-sub-amount-form',
  templateUrl: './sub-amount-form.component.html',
  styleUrls: ['./sub-amount-form.component.scss']
})
export class SubAmountFormComponent implements OnInit {

  @Output()
  add_amount: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  support: SupportInterface["MicrocreditSupport"];
  campaign: SupportInterface["MicrocreditCampaign"];

  submitForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supportService: SupportService
  ) {
    this.supportService.microcreditSupport.subscribe(support => this.support = support)
    this.supportService.microcreditCurrent.subscribe(campaign => this.campaign = campaign)
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
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

    this.support.amount = controls.amount.value;
    this.support.paid = controls.paid.value;
    this.supportService.changeMicrocreditSupport(this.support);
    this.add_amount.emit(this.support.amount);
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
