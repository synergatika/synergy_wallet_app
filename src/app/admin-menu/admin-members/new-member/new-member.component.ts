import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/**
 * Services
 */
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss']
})
export class NewMemberComponent implements OnInit, OnDestroy {

  /**
   * Forms
   */
  submitForm: FormGroup;
  submitted: boolean = false;
  validator: any;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  /**
   * Component Constructor
   *
   * @param cdRef: ChangeDetectorRef
   * @param router: Router
   * @param fb: FormBuilder
   * @param translate: TranslateService
   * @param authenticationService: AuthenticationService
   * @param staticDataService: StaticDataService
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private staticDataService: StaticDataService
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
	 * On destroy
	 */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }


  initForm() {
    this.submitForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(this.validator.email.minLength),
        Validators.maxLength(this.validator.email.maxLength)
      ])
      ],
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

    this.authenticationService.register_member(controls.email.value)
      .pipe(
        tap(
          data => {
            Swal.fire({
              title: this.translate.instant('MESSAGE.SUCCESS.TITLE'),
              text: this.translate.instant('MESSAGE.SUCCESS.MEMBER_CREATED'),
              icon: 'success',
              timer: 2500
            }).then((result) => {
              this.router.navigate(['/']);
            });
          },
          error => {
            console.log(error);
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