import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

// Services
import { MerchantsService } from '../core/services/merchants.service';
import { ItemsService } from '../core/services/items.service';

// Models
import { Merchant } from '../core/models/merchant.model';
import { Offer } from '../core/models/offer.model';
import { Post } from '../core/models/post.model';
import { Event } from '../core/models/event.model';

@Component({
  selector: 'app-customer-explore',
  templateUrl: './customer-explore.component.html',
  styleUrls: ['./customer-explore.component.sass']
})
export class CustomerExploreComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  merchants: Merchant[];
  posts: Post[];
  offers: Offer[];
  events: Event[];

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
    this.fetchPostsData();
    this.fetchEventsData();
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

  fetchPostsData() {
    this.itemsService.readAllPrivatePosts()
      .pipe(
        tap(
          data => {
            this.posts = data;
            console.log(this.posts)
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

  fetchEventsData() {
    this.itemsService.readAllPrivateEvents()
      .pipe(
        tap(
          data => {
            this.events = data;
            console.log(this.events);
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