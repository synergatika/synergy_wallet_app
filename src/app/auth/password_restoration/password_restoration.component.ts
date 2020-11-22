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
import { ConfirmPasswordValidator } from '../confirm-password.validator';
// Environment
import { environment } from '../../../environments/environment';
import { StaticDataService } from 'src/app/core/helpers/static-data.service';

@Component({
	selector: 'app-password-restoration',
	templateUrl: './password_restoration.component.html',
	styleUrls: ['./password_restoration.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PasswordRestorationComponent implements OnInit, OnDestroy {

	/**
	 * Parameters
	 */
	public token: string = '';
	tokenIsValid: boolean = false;

	/**
	 * Form
	 */
	authForm: FormGroup;
	validator: any;

	private unsubscribe: Subject<any>;
	loading: boolean = false;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component Constructor
	 *
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param translate: TranslateService
	 * @param authNoticeService: AuthNoticeService
	 * @param staticDataService: StaticDataService
	 * @param authenticationService: AuthenticationService
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		private authNoticeService: MessageNoticeService,
		private staticDataService: StaticDataService,
		private authenticationService: AuthenticationService
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
	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.token = params['token'];
		});
		this.initializeForm();
		this.checkToken();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
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
	 * Validate Token
	 */
	checkToken() {
		this.loading = true;

		this.authenticationService.restoration_checkToken(this.token)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.SUCCESS_CHECK'), 'success');
						this.tokenIsValid = true;
					}, error => {
						this.authNoticeService.setNotice(this.translate.instant(error), 'danger');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/forgot-password');
						}, environment.authTimeOuter);
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
	 * On Submit Form
	 */
	submitForm() {
		if (this.loading) return;

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
			newPassword: controls.newPassword.value,
			verPassword: controls.confirmPassword.value
		};

		this.authenticationService.restoration_updatePass(this.token, authData.newPassword, authData.verPassword)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.FORGOT_PASSWORD.SUCCESS_UPDATE'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/login');
						}, environment.authTimeOuter);
					},
					error => {
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