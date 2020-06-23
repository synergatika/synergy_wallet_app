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
// Others
import { ConfirmPasswordValidator } from './confirm-password.validator';
// Environment
import { environment } from '../../../environments/environment';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
	selector: 'kt-login',
	templateUrl: './password_restoration.component.html',
	styleUrls: ['./password_restoration.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PasswordRestorationComponent implements OnInit, OnDestroy {

	validator: any;
	passwordForm: FormGroup;

	public token: string = '';
	check: boolean = false;

	private unsubscribe: Subject<any>;
	loading: boolean = false;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component Constructor
	 *
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
	 * @param translate: TranslateService
	 * @param authNoticeService: AuthNoticeService
	 * @param authenticationService: AuthenticationService
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
		this.validator = this.staticDataService.getUserValidator;
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On Init
	 */
	ngOnInit() {
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

	checkToken() {
		this.authenticationService.restoration_checkToken(this.token)
			.pipe(
				tap(
					data => {
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
	 * Form Submit
	 */
	submit() {
		if (this.loading) return;
		this.loading = true;

		const controls = this.passwordForm.controls;
		/** check form */
		if (this.passwordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

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