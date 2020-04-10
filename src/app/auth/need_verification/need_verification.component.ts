// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Services
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
// Environment
import { environment } from '../../../environments/environment';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
	selector: 'kt-need-verification',
	templateUrl: './need_verification.component.html',
	encapsulation: ViewEncapsulation.None
})
export class NeedVerificationComponent implements OnInit, OnDestroy {

	validator: any;
	emailForm: FormGroup;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	loading: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 * @param translate: TranslateService
	 * @param authNoticeService: AuthNoticeService
	 * @param authenticationService: AuthenticationService
	 * @param staticDataService: StaticDataService
	 */
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		public authNoticeService: MessageNoticeService,
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
		if (this.loading) return;
		this.loading = true;

		const controls = this.emailForm.controls;
		/** check form */
		if (this.emailForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

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
