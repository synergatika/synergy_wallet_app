import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-archive-offers',
  templateUrl: './archive-offers.component.html',
  styleUrls: ['./archive-offers.component.scss']
})
export class ArchiveOffersComponent implements OnInit {
	offers: Offer[];
	loading: boolean = false;
	private unsubscribe: Subject<any>;
	
	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService,) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchOffersData();
	}
	
	fetchOffersData() {
		this.itemsService.readAllOffers()
		  .pipe(
			tap(
			  data => {
				this.offers = data;
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
	
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}
	
	onScroll() {
		console.log('scrolled!!');
		this.offers = this.offers.concat(this.offers);
		this.cdRef.markForCheck();
	}

}
