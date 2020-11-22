// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { TermsComponent } from '../terms/synergy_terms.component';
import { StaticDataService } from '../../core/helpers/static-data.service';

import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {

	public subAccessConfig: Boolean[] = environment.subAccess;

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
			fullname: controls.fullname.value,
			email: (controls.email.value).toLowerCase(),
			password: controls.password.value
		}

		this.authenticationService.register_as_member(authData.fullname, authData.email, authData.password)
			.pipe(
				tap(
					user => {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
						setTimeout(() => {
							this.router.navigateByUrl('/auth/login');
						}, 2500);
					}, error => {
						this.authNoticeService.setNotice(this.translate.instant(error), 'danger');
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
