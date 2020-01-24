// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
// import { Store } from '@ngrx/store';
// import { AppState } from '../../../../core/reducers';
// Auth
//import { AuthNoticeService, AuthService, Register, User } from '../../../../core/auth';

import { ConfirmPasswordValidator } from './confirm-password.validator';
import { AuthNoticeService } from '../../core/helpers/auth-notice/auth-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';

// Environment
import { environment } from '../../../environments/environment';

@Component({
	selector: 'kt-login',
	templateUrl: './password_restoration.component.html',
	encapsulation: ViewEncapsulation.None
})
export class PasswordRestorationComponent implements OnInit, OnDestroy {

	public validator = {
		password: {
			minLength: 3,
			maxLength: 100
		}
	}
	// Public params
	passwordForm: FormGroup;
	loading = false;

	check = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	token: string = '';
	private unsubscribe: Subject<any>;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param activatedRoute
	 */
	constructor(
		private router: Router,
		private authenticationService: AuthenticationService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		// private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute
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
		this.activatedRoute.params.subscribe(params => {
			this.token = params['token'];
		});
		this.initForm();
		this.checkToken();
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

	checkToken() {
		this.authenticationService
			.restoration_checkToken(this.token)
			.pipe(
				tap(data => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.SUCCESS_CHECK'), 'success');
					this.check = true;
				}, error => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.ERROR_CHECK'), 'danger');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/forgot-pass');
					}, environment.authTimeOuter);
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initForm() {

		this.passwordForm = this.fb.group({
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
			],
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.passwordForm.controls;
		/** check form */
		if (this.passwordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		if (this.loading) {
			return;
		}
		this.loading = true;

		const authData = {
			newPassword: controls.newPassword.value,
			verPassword: controls.confirmPassword.value
		}

		this.authenticationService
			.restoration_updatePass(this.token, authData.newPassword, authData.verPassword)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.SUCCESS_UPDATE'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/login');
						}, environment.authTimeOuter);
					},
					error => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.ERROR_UPDATE'), 'danger');
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
		const control = this.passwordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}