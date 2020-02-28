import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ScannerService } from '../_scanner.service';
import { OfferTransaction } from '../_scanner.interface';

@Component({
  selector: 'app-sub-offer-form',
  templateUrl: './sub-offer-form.component.html',
  styleUrls: ['./sub-offer-form.component.sass']
})
export class SubOfferFormComponent implements OnInit {

  @Output()
  add_offer: EventEmitter<number> = new EventEmitter<number>();

  transaction: OfferTransaction;

  submitted: boolean = false;
  submitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scannerService: ScannerService
  ) {
    this.scannerService.offerTransaction.subscribe(transaction => this.transaction = transaction);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
      quantity: [0, Validators.compose([
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => Validators.max(this.transaction.possible_quantity)(control)
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

    this.transaction.quantity = controls.quantity.value;
    this.transaction.discount_points = this.transaction.cost * this.transaction.quantity;
    this.scannerService.changeOfferTransaction(this.transaction);
    this.add_offer.emit(controls.quantity.value);
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
