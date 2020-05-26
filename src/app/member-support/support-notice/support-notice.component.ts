// Angular
import { Component, OnInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Notice
import { MessageNotice } from '../../core/helpers/message-notice/message-notice.interface'
import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service'

@Component({
	selector: 'support-notice',
	templateUrl: './support-notice.component.html',
})
export class SupportNoticeComponent implements OnInit, OnDestroy {
	@Output() type: any;
	@Output() message: string = '';

	private subscriptions: Subscription[] = [];

	/**
	 * Component Constructor
	 *
	 * @param cdr
	 * @param scannerNoticeService
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		public scannerNoticeService: MessageNoticeService
	) { }

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On Init
	 */
	ngOnInit() {
		this.subscriptions.push(this.scannerNoticeService.onNoticeChanged$.subscribe(
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
