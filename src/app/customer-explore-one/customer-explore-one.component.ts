import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

// Services
import { MerchantsService } from '../core/services/merchants.service';
import { ItemsService } from '../core/services/items.service';

// Models
import { Merchant } from '../core/models/merchant.model';
import { Offer } from '../core/models/offer.model';
import { PostEvent } from '../core/models/post_event.model';

@Component({
  selector: 'app-customer-explore-one',
  templateUrl: './customer-explore-one.component.html',
  styleUrls: ['./customer-explore-one.component.sass']
})
export class CustomerExploreOneComponent implements OnInit, OnDestroy {

  merchant_id: string = '';

  merchant: Merchant;
  offers: Offer[];
  posts_events: PostEvent[];

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private merchantsService: MerchantsService,
    private itemsService: ItemsService
  ) {
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.merchant_id = params['_id'];
    });
    this.unsubscribe = new Subject();
  }

  /**
	 * On init
	 */
  ngOnInit() {
    this.fetchMerchantData();
    this.fetchOffersData();
    this.fetchPostsEventsData();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }


  fetchMerchantData() {
    this.merchantsService.readMerchantInfo(this.merchant_id)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.merchant = data;
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
    this.itemsService.readOffersByStore(this.merchant_id)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.offers = data;
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
    this.itemsService.readPrivatePostsEventsByStore(this.merchant_id)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.posts_events = data;
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
