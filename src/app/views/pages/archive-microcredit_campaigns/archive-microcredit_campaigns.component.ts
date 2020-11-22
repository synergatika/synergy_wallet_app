import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { Offer } from 'sng-core';

@Component({
	selector: 'app-archive-microcredit_campaigns',
	templateUrl: './archive-microcredit_campaigns.component.html',
	styleUrls: ['./archive-microcredit_campaigns.component.scss']
})
export class ArchiveMicrocreditCampaignsComponent implements OnInit {

	/**
	 * Content Variables
	 */
	public offers: Offer[] = [];

	counter: number = 0;

	loading: boolean = false;
	private unsubscribe: Subject<any>;


	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param translate: TranslateService
	 * @param itemsService: ItemsService
	 */
	constructor(
		private cdRef: ChangeDetectorRef,
		public translate: TranslateService,
		private itemsService: ItemsService
	) {
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

	/**
	 * Fetch Offers List
	 */
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

	/**
	 * On Scroll
	 */
	onScroll() {
		this.counter = this.counter + 1;
		this.fetchOffersData(this.counter);
		console.log('scrolled!!');
		//	this.offers = this.offers.concat(this.offers);
		this.cdRef.markForCheck();
	}
}
