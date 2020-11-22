import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sub-email-form',
  templateUrl: './sub-email-form.component.html',
  styleUrls: ['./sub-email-form.component.sass']
})
export class SubEmailFormComponent implements OnInit {

  /**
   * Event Emitter
   */
  @Output()
  add_email: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  previous_step: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Form
   */
  stepperForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) {
  }

	/**
	 * On Init
	 */
  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.stepperForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.email,
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

    const email = controls.email.value;
    this.add_email.emit(email);
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
