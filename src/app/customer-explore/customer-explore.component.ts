import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

// Services
import { MerchantsService } from '../core/services/merchants.service';
import { ItemsService } from '../core/services/items.service';

// Models
import { Merchant } from '../core/models/merchant.model';
import { Offer } from '../core/models/offer.model';
import { PostEvent } from '../core/models/post_event.model';

@Component({
  selector: 'app-customer-explore',
  templateUrl: './customer-explore.component.html',
  styleUrls: ['./customer-explore.component.sass']
})
export class CustomerExploreComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  merchants: Merchant[];
  offers: Offer[];
  posts_events: PostEvent[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private merchantsService: MerchantsService,
    private itemsService: ItemsService,
  ) {
    this.unsubscribe = new Subject();
  }

  /**
	 * On init
	 */
  ngOnInit() {
    this.fetchMerchantsData();
    this.fetchOffersData();
    this.fetchPostsEventsData();
  }

  /**
   * On destroy
   */
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  fetchMerchantsData() {
    this.merchantsService.readMerchants()
      .pipe(
        tap(
          data => {
            this.merchants = data;
            console.log(this.merchants)
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

  fetchPostsEventsData() {
    this.itemsService.readAllPrivatePostsEvents()
      .pipe(
        tap(
          data => {
            this.posts_events = data;
            console.log(this.posts_events)
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