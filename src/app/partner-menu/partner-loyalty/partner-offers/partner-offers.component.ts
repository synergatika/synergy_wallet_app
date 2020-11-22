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
import { Offer } from 'sng-core';

@Component({
	selector: 'app-partner-offers',
	templateUrl: './partner-offers.component.html',
	styleUrls: ['./partner-offers.component.scss']
})
export class PartnerOffersComponent implements OnInit, OnDestroy {

	/**
	 * Content Variables
	 */
	public offers: Offer[];

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
		this.fetchOffersData();
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
	 * Fetch Offers Data (for One Partner)
	 */
	fetchOffersData() {
		this.itemsService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.offers = data;
						console.log("Partner Offers", this.offers)
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
