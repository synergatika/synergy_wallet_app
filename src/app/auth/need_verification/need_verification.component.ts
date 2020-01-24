// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
//import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { AuthNoticeService } from '../../core/helpers/auth-notice/auth-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';

// Environment
import { environment } from '../../../environments/environment';

@Component({
	selector: 'kt-need-verification',
	templateUrl: './need_verification.component.html',
	encapsulation: ViewEncapsulation.None
})
export class NeedVerificationComponent implements OnInit, OnDestroy {

	public validator = {
		email: {
			minLength: 3,
			maxLength: 100
		}
	}

	// Public params
	emailForm: FormGroup;
	loading = false;
	errors: any = [];

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param  authenticationService: AuthenticationService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 */
	constructor(
		private authenticationService: AuthenticationService,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initForm();
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

		this.emailForm = this.fb.group({
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(this.validator.email.minLength),
				Validators.maxLength(this.validator.email.maxLength) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.emailForm.controls;
		/** check form */
		if (this.emailForm.invalid) {
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
			email: (controls.email.value).toLowerCase()
		};
		this.authenticationService
			.verification_askEmail(authData.email)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.SUCCESS_SEND'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/');
						}, environment.authTimeOuter);
					},
					error => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.ERROR_SEND'), 'danger');
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
		const control = this.emailForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
