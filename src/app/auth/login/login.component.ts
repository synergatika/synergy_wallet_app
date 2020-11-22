// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Services
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { StaticDataService } from '../../core/helpers/static-data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

	/**
	 * Form
	 */
  authForm: FormGroup;
  validator: any;

  returnUrl: string;

  private unsubscribe: Subject<any>;
  loading = false;

  // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component Constructor
	 *
	 * @param router: Router
	 * @param fb: FormBuilder,
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
	 * @param translate: TranslateService
	 * @param authNoticeService: MessageNoticeService
	 * @param authenticationService: AuthenticationService,
	 * @param staticDataService: StaticDataService
	 */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private authNoticeService: MessageNoticeService,
    private authenticationService: AuthenticationService,
    private staticDataService: StaticDataService,
  ) {
    this.validator = this.staticDataService.getValidators.user;
    this.unsubscribe = new Subject();
  }

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On Init
	 */
  ngOnInit(): void {
    this.initializeForm();

    // redirect back to the returnUrl before login
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/';
    });
  }

	/**
	 * On destroy
	 */
  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

	/**
	 * Form Initialization
	 */
  initializeForm() {
    this.authForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(this.validator.email.minLength),
        Validators.maxLength(this.validator.email.maxLength) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validator.password.minLength),
        Validators.maxLength(this.validator.password.maxLength)
      ])
      ]
    });
  }

	/**
	 * On Submit Form
	 */
  submitForm(): void {
    if (this.loading) return;
    this.authNoticeService.setNotice(null);

    const controls = this.authForm.controls;
    /** check form */
    if (this.authForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.loading = true;

    const authData = {
      email: (controls.email.value).toLowerCase(),
      password: controls.password.value
    };

    this.authenticationService.authenticate(authData.email, authData.password)
      .pipe(
        tap(
          data => {
            if ((data.action) && (data.action === 'need_email_verification')) {
              this.authNoticeService.setNotice(
                this.translate.instant('AUTH.LOGIN.EMAIL_NEEDS_VERIFICATION'), 'warning');
              this.router.navigateByUrl('auth/need-verification');
            }
            else if ((data.action) && (data.action === 'need_password_verification')) {
              this.authNoticeService.setNotice(
                this.translate.instant('AUTH.LOGIN.PASSWORD_NEEDS_UPDATE'), 'warning');
              this.router.navigateByUrl('auth/verify-password/' + authData.email);
            }

            else if ((data.action) && (data.action === 'need_account_activation')) {
              this.authNoticeService.setNotice(
                this.translate.instant('AUTH.LOGIN.ACCOUNT_NEEDS_ACTIVATION'), 'warning');
            }
            else if (data.user) {
              this.authenticationService.setCurrentUserValue(data);
              this.router.navigateByUrl('/');
            };
          }, error => {
            this.authNoticeService.setNotice(this.translate.instant(error), 'danger');
          }),
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
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
    const control = this.authForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
