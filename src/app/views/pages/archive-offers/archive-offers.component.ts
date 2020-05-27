import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../../../core/services/items.service';
import { Offer } from '../../../core/models/offer.model';

@Component({
	selector: 'app-archive-offers',
	templateUrl: './archive-offers.component.html',
	styleUrls: ['./archive-offers.component.scss']
})
export class ArchiveOffersComponent implements OnInit {

	public offers: Offer[] = [];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	counter: number = 0;

	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchOffersData(this.counter);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	fetchOffersData(counter: number) {
		this.itemsService.readAllOffers(`6-${counter.toString()}-0`)
			.pipe(
				tap(
					data => {
						this.offers = this.offers.concat(data);
						//	this.offers = data;
						console.log(this.offers)

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

	onScroll() {
		this.counter = this.counter + 1;
		this.fetchOffersData(this.counter);
		console.log('scrolled!!');
		//	this.offers = this.offers.concat(this.offers);
		this.cdRef.markForCheck();
	}
}
