// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap, catchError } from 'rxjs/operators';
import { first } from 'rxjs/operators';

// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
// import { Store } from '@ngrx/store';
// import { AppState } from '../../../../core/reducers';
// Auth
//import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';
import { AuthNoticeService } from '../../core/helpers/auth-notice/auth-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';

// Environment
import { environment } from '../../../environments/environment';

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: 'admin@demo.com',
	PASSWORD: 'demo'
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

	public validator = {
		email: {
			minLength: 3,
			maxLength: 100
		},
		password: {
			minLength: 3,
			maxLength: 100
		}
	}

	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	loginForm: FormGroup;
	submitted: boolean = false;

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param authenticationService: AuthenticationService,
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
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
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		/*if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}*/

		this.loginForm = this.fb.group({
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
	 * Form Submit
	 */
	submit() {
		if (this.submitted) return;

		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
		this.submitted = true;

		const authData = {
			email: (controls.email.value).toLowerCase(),
			password: controls.password.value
		};
		this.authenticationService
			.authenticate(authData.email, authData.password)
			.pipe(
				tap(
					data => {
						if ((data.message) && (data.message === 'need_email_verification')) {
							this.authNoticeService.setNotice(this.translate.instant('AUTH.LOGIN.EMAIL_NEEDS_VERIFICATION'), 'success');
						}
						else if ((data.message) && (data.message === 'need_password_verification')) {
							this.authNoticeService.setNotice(this.translate.instant('AUTH.LOGIN.PASSWORD_NEEDS_UPDATE'), 'success');
							this.router.navigateByUrl('auth/verify-password/' + authData.email); // Main page
						}
						else if (data.data) {
							this.authenticationService.setCurrentUserValue(data.data);
							this.router.navigateByUrl('/'); // Main page
						}
					},
					error => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
						this.submitted = false;
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
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
