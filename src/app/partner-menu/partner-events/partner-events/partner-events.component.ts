import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

/**
 * Services
 */
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { Event } from 'sng-core';

@Component({
	selector: 'app-partner-events',
	templateUrl: './partner-events.component.html',
	styleUrls: ['./partner-events.component.scss']
})
export class PartnerEventsComponent implements OnInit, OnDestroy {

	/**
	 * Content Variables
	 */
	public events: Event[];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	/**
     * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param authenticationService: AuthenticationService
	 * @param itemsService: ItemsService
	 */
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

	/**
	 * Fetch Events Data (for One Partner)
	 */
	fetchEventsData() {
		this.itemsService.readPrivateEventsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.events = data;
						console.log("Partner Events", this.events);
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
