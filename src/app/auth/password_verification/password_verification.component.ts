// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
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
import { TermsComponent } from '../terms/synergy_terms.component';

@Component({
	selector: 'kt-register',
	templateUrl: './password_verification.component.html',
	encapsulation: ViewEncapsulation.None
})
export class PasswordVerificationComponent implements OnInit, OnDestroy {

	public validator = {
		password: {
			minLength: 3,
			maxLength: 100
		}
	}

	verifyForm: FormGroup;
	token: string = '';

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	loading: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 * @param dialog: MatDialog
	 * @param activatedRoute: ActivatedRoute
	 * @param translate: TranslateService
	 * @param authNoticeService: MessageNoticeService
	 * @param authenticationService: AuthenticationService
	 */
	constructor(
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		public dialog: MatDialog,
		private activatedRoute: ActivatedRoute,
		private translate: TranslateService,
		private authNoticeService: MessageNoticeService,
		private authenticationService: AuthenticationService,
	) {
		this.unsubscribe = new Subject();
	}

	/*
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
	}

	/*
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
		this.verifyForm = this.fb.group({
			password: ['', Validators.compose([
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
			],
			agree: [false, Validators.compose([Validators.required])]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
	}

	openTermsDialog() {
		const dialogRef = this.dialog.open(TermsComponent, {
			height: '450px'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		if (this.loading) return;
		this.loading = true;

		const controls = this.verifyForm.controls;
		/** check form */
		if (this.verifyForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		if (!controls.agree.value) {
			this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
			return;
		}

		const _user = {
			old_password: controls.password.value,
			new_password: controls.newPassword.value
		}
		this.authenticationService.set_password(this.token, _user.old_password, _user.new_password).pipe(
			tap(
				data => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_PASSWORD.SUCCESS'), 'success');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/login');
						this.authNoticeService.setNotice(null);
					}, 2500);

				},
				error => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_PASSWORD.ERROR'), 'danger');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/login');
						this.authNoticeService.setNotice(null);
					}, 2500);
				}),
			takeUntil(this.unsubscribe),
			finalize(() => {
				this.loading = false;
				this.cdr.markForCheck();
			})
		).subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.verifyForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
