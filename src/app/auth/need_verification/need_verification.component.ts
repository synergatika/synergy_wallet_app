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
import { StaticDataService } from 'src/app/core/helpers/static-data.service';

@Component({
	selector: 'app-need-verification',
	templateUrl: './need_verification.component.html',
	styleUrls: ['./need_verification.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NeedVerificationComponent implements OnInit, OnDestroy {

	/**
	 * Form
	 */
	authForm: FormGroup;
	validator: any;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	loading: boolean = false;

	/**
	 * Component Constructor
	 *
	 * @param cdr: ChangeDetectorRef
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param translate: TranslateService
	 * @param authNoticeService: AuthNoticeService
	 * @param staticDataService: StaticDataService
	 * @param authenticationService: AuthenticationService
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		private router: Router,
		private fb: FormBuilder,
		private translate: TranslateService,
		public authNoticeService: MessageNoticeService,
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
		this.initializeForm();
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
			email: (controls.email.value).toLowerCase()
		};

		this.authenticationService.verification_askEmail(authData.email)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.SUCCESS_SEND'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/');
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
