import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../../../core/services/items.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-merchant-events',
  templateUrl: './merchant-events.component.html',
  styleUrls: ['./merchant-events.component.scss']
})
export class MerchantEventsComponent implements OnInit {
	loading: boolean = false;
	private unsubscribe: Subject<any>;
	events: any;
	
	constructor(private itemsService: ItemsService, private cdRef: ChangeDetectorRef, private authenticationService: AuthenticationService) { 
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchEventsData();
	}
	
	fetchEventsData() {
		//this.itemsService.readPrivateEventsByStore(this.authenticationService.currentUserValue.user["_id"])
		this.itemsService.readPublicEventsByStore(this.authenticationService.currentUserValue.user["_id"])
		
		  .pipe(
			tap(
			  data => {
				this.events = data;
				console.log(this.events)
				//this.scannerService.changeOffers(this.events);
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
