// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Services
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { StaticDataService } from 'src/app/core/helpers/static-data.service';
// Others
import { ConfirmPasswordValidator } from '../confirm-password.validator';
import { TermsComponent } from '../terms/synergy_terms.component';

@Component({
	selector: 'app-password-verification',
	templateUrl: './password_verification.component.html',
	styleUrls: ['./password_verification.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PasswordVerificationComponent implements OnInit, OnDestroy {

	/**
	 * Parameters
	 */
	public token: string = '';

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
	 * @param router: Router
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 * @param dialog: MatDialog
	 * @param activatedRoute: ActivatedRoute
	 * @param translate: TranslateService
	 * @param authNoticeService: MessageNoticeService
	 * @param authenticationService: AuthenticationService
	 * @param staticDataService: StaticDataService
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
		private staticDataService: StaticDataService,
	) {
		this.validator = this.staticDataService.getValidators.user;
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
		this.initializeForm();
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
	 * Form Initialization
	 */
	initializeForm() {
		this.authForm = this.fb.group({
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
			agree: [false, Validators.compose([Validators.requiredTrue])]
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
			oldPassword: controls.password.value,
			newPassword: controls.newPassword.value
		};

		this.authenticationService.set_password(this.token, authData.oldPassword, authData.newPassword)
			.pipe(
				tap(
					data => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_PASSWORD.SUCCESS'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/login');
							this.authNoticeService.setNotice(null);
						}, 2500);

					},
					error => {
						this.authNoticeService.setNotice(this.translate.instant(error), 'danger');
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
		const control = this.authForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
