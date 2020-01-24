import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, takeUntil, finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2'

// Translate
import { TranslateService } from '@ngx-translate/core';

// Services
import { AuthenticationService } from '../../core/services/authentication.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  public validator: any = {
    password: {
      minLength: 3,
      maxLenth: 100
    }
  };

  profile: any = {
    oldPassword: '',
    newPassword: '',
    verPassword: ''
  }
  submitForm: FormGroup;
  submitted = false;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * @param cdRef: ChangeDetectorRef
   * @param authenticationService: AuthenticationService
   * @param fb: FormBuilder
   * @param translate: TranslateService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.unsubscribe = new Subject();
  }

  initForm() {
    this.submitForm = this.fb.group({
      oldPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.password.minLength),
        Validators.maxLength(this.validator.password.maxLength)
      ])
      ],
      newPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.password.minLength),
        Validators.maxLength(this.validator.password.maxLength)
      ])
      ],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.password.minLength),
        Validators.maxLength(this.validator.password.maxLength)
      ])
      ]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    if (this.submitted) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.submitted = true;

    const authData = {
      oldPassword: controls.oldPassword.value,
      newPassword: controls.newPassword.value
    };

    this.authenticationService.change_pass(authData.oldPassword, authData.newPassword)
      .pipe(
        tap(
          data => {
            Swal.fire(
              this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              this.translate.instant('MESSAGE.SUCCESS.PASSWORD_UPDATED'),
              'success'
            );
          },
          error => {
            Swal.fire(
              this.translate.instant('MESSAGE.ERROR.TITLE'),
              this.translate.instant('MESSAGE.ERROR.SERVER'),
              'error'
            );
            this.submitted = false;
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
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
