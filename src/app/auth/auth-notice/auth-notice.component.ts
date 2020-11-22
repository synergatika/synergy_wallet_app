// Angular
import { Component, OnInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Notice
import { MessageNotice } from '../../core/helpers/message-notice/message-notice.interface'
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service'

@Component({
	selector: 'auth-notice',
	templateUrl: './auth-notice.component.html',
})
export class AuthNoticeComponent implements OnInit, OnDestroy {
	@Output() type: any;
	@Output() message: any = '';

	private subscriptions: Subscription[] = [];

	/**
	 * Component Constructor
	 *
	 * @param cdr
	 * @param authNoticeService
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		public authNoticeService: MessageNoticeService
	) {
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On Init
	 */
	ngOnInit() {
		this.subscriptions.push(this.authNoticeService.onNoticeChanged$.subscribe(
			(notice: MessageNotice) => {
				notice = Object.assign({}, { message: '', type: '' }, notice);
				this.message = notice.message;
				this.type = notice.type;
				this.cdr.markForCheck();
			}
		));
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
