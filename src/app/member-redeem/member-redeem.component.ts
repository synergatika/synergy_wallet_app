//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { ItemsService } from '../core/services/items.service';
import { Offer } from '../core/models/offer.model';
import { StaticDataService } from '../core/services/static-data.service';

@Component({
  selector: 'app-member-redeem',
  templateUrl: './member-redeem.component.html',
  styleUrls: ['./member-redeem.component.scss']
})
export class MemberRedeemComponent implements OnInit, OnDestroy {

  public offers: Offer[];

  customOptions: OwlOptions;

  loading: boolean = false;
  private unsubscribe: Subject<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    public translate: TranslateService,
    private itemsService: ItemsService,
    private staticDataService: StaticDataService,
  ) {
    this.customOptions = staticDataService.getOwlOptionsThree;
    this.unsubscribe = new Subject();
  }
	/**
	* On Init
	*/
  ngOnInit() {
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

  //	Get the Offers
  fetchOffersData() {
    this.itemsService.readAllOffers('0-0-1')
      .pipe(
        tap(
          data => {
            this.offers = data;
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

}
