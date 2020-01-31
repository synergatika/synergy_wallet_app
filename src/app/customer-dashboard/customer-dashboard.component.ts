import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';

import { AuthenticationService } from '../core/services/authentication.service';
import { LoyaltyService } from '../core/services/loyalty.service';
import { ItemsService } from '../core/services/items.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

  balance: number = 0;
  offers: any;
  loading: boolean = false;
  private unsubscribe: Subject<any>;
  list = [
		{
			id: "Commonspace34533",
			title: "Ζαπατίστικος Καφές",
			desc: "Έχοντας προαγοράσει Ζαπατίστικο Καφέ μας βοηθάς να τον εισάγουμε απευθείας από την Τσιάπας χωρίς μεσάζοντες.",
			coop_id: "Synallois14234562456",
			begins: "1.5.2020",
			expires: "4.6.2020",
			points: "50",
			price_reduced: "160",
			price_initial: "200",
			img: './assets/media/images/syballis-micro-humbnail.jpg'
			
		},
		{
			id: "Ekdoseis3d76r3",
			title: "Ετήσια Βιβλιοσυνδρομή",
			coop_id: "Ekdoseis34562456",
			expires: "March 15, 2020",
			points: "55",
			price_reduced: "80",
			price_initial: "140",
			img: './assets/media/images/ekdoseis.png'
		},
	];
	
	coops = {
		"Synallois14234562456" : {
			"id":"Synallois14234562456",
			"name": "Συν Άλλοις",
			"img": "./assets/media/images/uploaded/commonspace.webp",
			"sector": "Recreation and Culture",
			"subscription_date": "Jan 5, 2020",
			"email": "info@commonspace.gr",
			"phone": "2103606333",
			"address": "Akakiou 1 - 3 & Ipeirou 60, 10439, Athens"
		},
		"Ekdoseis34562456" : {
			"id":"Ekdoseis34562456",
			"name": "Εκδόσεις των Συναδέλφων",
			"img": "./assets/media/images/uploaded/synallois.jpg",
			"sector": "Food",
			"subscription_date": "Jan 1, 2020",
			"email": "info@synallois.org",
			"phone": "2103606333",
			"address": "Nileos 35, 11851, Athens"
		},
	}

  /**
 * Component constructor
 *
 * @param cdRef: ChangeDetectorRef
 * @param authenticationService: AuthenticationService
 * @param loyaltyService: LoyaltyService
 */
  constructor(
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private loyaltyService: LoyaltyService,
	private itemsService: ItemsService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
  * On init
  */
  ngOnInit() {
    this.fetchBalanceData();
	this.fetchOffersData();
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchBalanceData() {
    this.loyaltyService.readBalance()
      .pipe(
        tap(
          data => {
            this.balance = parseInt(data.points, 16);
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
}