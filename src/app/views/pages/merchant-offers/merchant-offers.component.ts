import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ScannerInterface } from '../../../scanner/_scanner.interface';
import { ScannerService } from '../../../scanner/_scanner.service';
import { ItemsService } from '../../../core/services/items.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-merchant-offers',
  templateUrl: './merchant-offers.component.html',
  styleUrls: ['./merchant-offers.component.scss']
})
export class MerchantOffersComponent implements OnInit {
	loading: boolean = false;
	private unsubscribe: Subject<any>;
	offers: ScannerInterface["Offer"][];
	
	constructor(private itemsService: ItemsService, private cdRef: ChangeDetectorRef, private authenticationService: AuthenticationService,private scannerService: ScannerService,) { 
		this.scannerService.offers.subscribe(offers => this.offers = offers);
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchOffersData();
	}
	
	fetchOffersData() {
		this.itemsService.readOffersByStore(this.authenticationService.currentUserValue.user["_id"])
		  .pipe(
			tap(
			  data => {
				this.offers = data;
				console.log(this.offers)
				this.scannerService.changeOffers(this.offers);
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
}
