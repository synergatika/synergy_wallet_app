import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ScannerService } from '../_scanner.service';
import { ScannerInterface } from '../_scanner.interface';

@Component({
  selector: 'app-sub-microcredit-form',
  templateUrl: './sub-microcredit-form.component.html',
  styleUrls: ['./sub-microcredit-form.component.scss']
})
export class SubMicrocreditFormComponent implements OnInit {

  @Output()
  add_microcredit: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  public transaction: ScannerInterface["MicrocreditTransaction"];
  public supports: ScannerInterface["MicrocreditSupport"][];

  submitted: boolean = false;
  submitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scannerService: ScannerService
  ) {
    this.scannerService.microcreditTransaction.subscribe(transaction => this.transaction = transaction);
    this.scannerService.microcreditSupports.subscribe(orders => this.supports = orders);
  }

  ngOnInit() {
    console.log(this.supports);
    this.initForm();
  }

  isRadioButtonDisable(support: ScannerInterface["MicrocreditSupport"]) {
    return (support.redeemedTokens === support.initialTokens) || (support.status === 'order');
  }

  isRadioButtonChecked(support: ScannerInterface["MicrocreditSupport"]) {
    return (support.support_id === this.transaction.support_id);
  }

  onRadioButtonChange(support: ScannerInterface["MicrocreditSupport"]) {
    if (this.isRadioButtonDisable(support)) return;
    const currentOrder = this.supports[this.supports.map(function (e) { return e.support_id; }).indexOf(support.support_id)];
    this.transaction.initial_tokens = currentOrder.initialTokens;
    this.transaction.redeemed_tokens = currentOrder.redeemedTokens;
    this.transaction.possible_tokens = (this.transaction.initial_tokens - this.transaction.redeemed_tokens);
    this.transaction.support_id = currentOrder.support_id;
    console.log(this.transaction);
    this.scannerService.changeMicrocreditTransaction(this.transaction);
  }

  initForm() {
    this.submitForm = this.fb.group({
      tokens: [0, Validators.compose([
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.transaction.possible_tokens)(control)
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

    this.transaction.discount_tokens = controls.tokens.value;
    this.scannerService.changeMicrocreditTransaction(this.transaction);
    this.add_microcredit.emit(controls.tokens.value);
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
