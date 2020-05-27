// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
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
import { StaticDataService } from '../../core/services/static-data.service';

import { environment } from '../../../environments/environment';

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {

	public subAccessConfig: Boolean[] = environment.subAccess;

	validator: any;
	registerForm: FormGroup;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	loading: boolean = false;

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param fb: FormBuilder,
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
	 * @param dialog: MatDialog
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
		public dialog: MatDialog,
		private translate: TranslateService,
		private authNoticeService: MessageNoticeService,
		private authenticationService: AuthenticationService,
		private staticDataService: StaticDataService,
	) {
		this.validator = this.staticDataService.getUserValidator;
		this.unsubscribe = new Subject();
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On Init
	 */
	ngOnInit() {
		this.initRegisterForm();
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
	initRegisterForm() {
		this.registerForm = this.fb.group({
			fullname: ['', Validators.compose([
				Validators.required,
				Validators.minLength(this.validator.name.minLength),
				Validators.maxLength(this.validator.name.maxLength)
			])
			],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(this.validator.email.minLength),
				Validators.maxLength(this.validator.email.maxLength)
			]),
			],
			password: ['', Validators.compose([
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
	 * Form Submit
	 */
	submit() {
		if (this.loading) return;
		this.loading = true;

		const controls = this.registerForm.controls;
		/** check form */
		if (this.registerForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		// if (!controls.agree.value) {
		// 	this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.AGREEMENT_REQUIRED'), 'danger');
		// 	this.loading = false;
		// 	return;
		// }

		const _user = {
			fullname: controls.fullname.value,
			email: (controls.email.value).toLowerCase(),
			password: controls.password.value
		}

		this.authenticationService.register_as_member(_user.fullname, _user.email, _user.password)
			.pipe(
				tap(
					user => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/login');
						}, 2500);
					}, error => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.ERROR'), 'danger');
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
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
