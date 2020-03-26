import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

import { Event } from '../../../core/models/event.model';

@Component({
	selector: 'app-merchant-events',
	templateUrl: './merchant-events.component.html',
	styleUrls: ['./merchant-events.component.scss']
})
export class MerchantEventsComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public events: Event[];

	constructor(
		private cdRef: ChangeDetectorRef,
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchEventsData();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	fetchEventsData() {
		this.itemsService.readPrivateEventsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.events = data;
						console.log(this.events)
					},
					error => {
					}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}
}
