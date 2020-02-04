import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { MerchantsService } from '../../../core/services/merchants.service';
import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-explore',
  templateUrl: './customer-explore.component.html',
  styleUrls: ['./customer-explore.component.scss']
})
export class CustomerExploreComponent implements OnInit, OnDestroy {
	config: any = {
		// Optional parameters
		loop: true,

		// If we need pagination
		pagination: {
		  el: '.swiper-pagination',
		  clickable: true
		},

		// Navigation arrows
		navigation: {
		  nextEl: '.swiper-button-next',
		  prevEl: '.swiper-button-prev',
		},

	};
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	merchants: any;
	posts: any;
	offers: any;
	events: any;
	@ViewChild('coopModal', {static: false}) coopModal;
	
  constructor(
    private cdRef: ChangeDetectorRef,
    private merchantsService: MerchantsService,
    private itemsService: ItemsService,
	private modalService: NgbModal,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.fetchMerchantsData();
    this.fetchPostsData();
    this.fetchOffersData();
  }

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

  fetchPostsData() {
    this.itemsService.readAllPrivatePosts()
      .pipe(
        tap(
          data => {
            this.posts = data;
			console.log("posts");
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
  
  openCoop(coop) {
		console.log('coop modal');
		//console.log(coop);
		this.modalService.open(this.coopModal).result.then((result) => {
			console.log('closed');

			}, (reason) => {
				console.log('dismissed');

        });
  }
}