
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SupportService } from "../_support.service";
import { SupportInterface } from "../_support.interface";

@Component({
  selector: 'app-sub-identifier-form',
  templateUrl: './sub-identifier-form.component.html',
  styleUrls: ['./sub-identifier-form.component.scss']
})
export class SubIdentifierFormComponent implements OnInit {

  @Output()
  add_identifier: EventEmitter<string> = new EventEmitter<string>();

  scanned: boolean = false;
  user: SupportInterface["User"];

  submitted: boolean = false;
  submitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private scannerService: SupportService
  ) {
    this.scannerService.user.subscribe(user => this.user = user)
  }


  scanSuccessHandler(result: string): void {
    if (this.scanned) return;
    this.scanned = true;
  }

  scanErrorHandler(error: any): void {
    console.log("Error");
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.submitForm = this.fb.group({
      identifier: ['', Validators.compose([
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


    this.user.identifier_form = controls.identifier.value;
    this.scannerService.changeUser(this.user);
    this.add_identifier.emit(controls.identifier.value);
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