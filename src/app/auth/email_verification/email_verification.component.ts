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
import { AuthNoticeService } from '../../core/helpers/auth-notice/auth-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';

// Environment
import { environment } from '../../../environments/environment';

@Component({
	selector: 'kt-login',
	templateUrl: './email_verification.component.html',
	encapsulation: ViewEncapsulation.None
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
	// Public params
	verifyForm: FormGroup;
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
	 * @param authenticationService: AuthenticationService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	//  * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
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
			.verification_checkToken(this.token)
			.pipe(
				tap(data => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.SUCCESS_CHECK'), 'success');
					this.check = true;
					setTimeout(() => {
						this.router.navigateByUrl('/auth/login');
					}, environment.authTimeOuter);
				}, error => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.ERROR_CHECK'), 'danger');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/need-verification');
					}, environment.authTimeOuter);
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.cdr.markForCheck();
				})
			)
			.subscribe();
	}
}
