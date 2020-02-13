import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { LoyaltyLocalService } from "../loyaltyLocal.service";
import { LoyaltyLocalInterface } from "../loyaltyLocal.interface";

@Component({
  selector: 'app-sub-email-form',
  templateUrl: './sub-email-form.component.html',
  styleUrls: ['./sub-email-form.component.sass']
})
export class SubEmailFormComponent implements OnInit {

  @Output()
  add_email: EventEmitter<string> = new EventEmitter<string>();

  submitForm: FormGroup;
  submitted: boolean = false;

  user: LoyaltyLocalInterface["User"];

  constructor(
    private fb: FormBuilder,
    private loyaltyLocalService: LoyaltyLocalService
  ) {
    this.loyaltyLocalService.user.subscribe(user => this.user = user)
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.email,
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

    this.user.email = controls.email.value;
    this.loyaltyLocalService.changeUser(this.user);
    this.add_email.emit(this.user.email);
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
