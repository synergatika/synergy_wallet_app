import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ScannerInterface } from '../../scanner/_scanner.interface';
import { ScannerService } from '../../scanner/_scanner.service';
import { ItemsService } from '../../core/services/items.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Offer } from '../../core/models/offer.model';

@Component({
	selector: 'app-partner-offers',
	templateUrl: './partner-offers.component.html',
	styleUrls: ['./partner-offers.component.scss']
})
export class PartnerOffersComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public offers: Offer[];

	constructor(
		private cdRef: ChangeDetectorRef,
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService,
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

	fetchOffersData() {
		this.itemsService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						console.log(this.offers)
						this.offers = data;
						console.log(this.offers)
						//	this.scannerService.changeOffers(this.offers);
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
