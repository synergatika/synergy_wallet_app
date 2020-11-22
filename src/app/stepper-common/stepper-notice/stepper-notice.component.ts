import { Component, OnInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageNoticeService } from '../../core/helpers/message-notice/message-notice.service'
import { MessageNotice } from '../../core/helpers/message-notice/message-notice.interface'

@Component({
	selector: 'stepper-notice',
	templateUrl: './stepper-notice.component.html',
})
export class StepperNoticeComponent implements OnInit, OnDestroy {
	@Output() type: any;
	@Output() message: any = '';

	private subscriptions: Subscription[] = [];

	/**
	 * Component Constructor
	 *
	 * @param cdr: ChangeDetectorRef,
	 * @param stepperNoticeService: MessageNoticeService
	 */
	constructor(
		private cdr: ChangeDetectorRef,
		public stepperNoticeService: MessageNoticeService
	) { }

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
    */

	/**
	 * On Init
	 */
	ngOnInit() {
		this.subscriptions.push(this.stepperNoticeService.onNoticeChanged$.subscribe(
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
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
}
