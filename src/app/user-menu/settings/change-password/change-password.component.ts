import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2'

/**
 * Services
 */
import { StaticDataService } from '../../../core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

/**
 * Validators
 */
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  /**
   * Forms
   */
  submitForm: FormGroup;
  submitted: boolean = false;
  validator: any;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * @param cdRef: ChangeDetectorRef
   * @param fb: FormBuilder
   * @param translate: TranslateService
   * @param staticDataService: StaticDataService
   * @param authenticationService: AuthenticationService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private translate: TranslateService,
    private staticDataService: StaticDataService,
    private authenticationService: AuthenticationService,
  ) {
    this.validator = this.staticDataService.getValidators.user;
    this.unsubscribe = new Subject();
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.initForm();
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Initialize Form
   */
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


  onSubmit() {
    if (this.loading) return;

    const controls = this.submitForm.controls;
    /** check form */
    if (this.submitForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

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
              this.translate.instant(error),
              'error'
            );
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdRef.markForCheck();
        })
      )
      .subscribe();

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
