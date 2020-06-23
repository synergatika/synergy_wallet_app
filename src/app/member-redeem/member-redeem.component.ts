//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { StaticDataService } from '../core/services/static-data.service';
import { ItemsService } from '../core/services/items.service';

/**
 * Models & Interfaces
 */
import { Offer } from '../core/models/offer.model';

@Component({
  selector: 'app-member-redeem',
  templateUrl: './member-redeem.component.html',
  styleUrls: ['./member-redeem.component.scss']
})
export class MemberRedeemComponent implements OnInit, OnDestroy {

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
    private itemsService: ItemsService,
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
  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  /**
   * Fetch Offers List
   */
  fetchOffersData(counter: number) {
    this.itemsService.readAllOffers(`6-${counter.toString()}-1`)
      .pipe(
        tap(
          data => {
            console.log(data);
            this.offers = this.offers.concat(data);
            //            this.offers = data;
          },
          error => {
            console.log(error);
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
