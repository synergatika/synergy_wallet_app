// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

/**
 * Services
 */
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-login',
	templateUrl: './email_verification.component.html',
	styleUrls: ['./email_verification.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class EmailVerificationComponent implements OnInit, OnDestroy {

	/**
	 * Parameters
	 */
	public token: string = '';

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component Constructor
	 *
	 * @param cdr: ChangeDetectorRef
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param translate: TranslateService
	 * @param authNoticeService: MessageNoticeService
	 * @param authenticationService: AuthenticationService,
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private authNoticeService: MessageNoticeService,
		private authenticationService: AuthenticationService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On Init
	 */
	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.token = params['token'];
		});
		this.checkToken();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Validate Token
	 */
	checkToken() {
		this.loading = true;

		this.authenticationService.verification_checkToken(this.token)
			.pipe(
				tap(data => {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VERIFY_EMAIL.SUCCESS_CHECK'), 'success');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/login');
					}, environment.authTimeOuter);
				}, error => {
					this.authNoticeService.setNotice(this.translate.instant(error), 'danger');
					setTimeout(() => {
						this.router.navigateByUrl('/auth/need-verification');
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
}
