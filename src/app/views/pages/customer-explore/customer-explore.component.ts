import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { MerchantsService } from '../../../core/services/merchants.service';
import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-customer-explore',
  templateUrl: './customer-explore.component.html',
  styleUrls: ['./customer-explore.component.scss']
})
export class CustomerExploreComponent implements OnInit, OnDestroy {
	moved;
	singleCoop: any;
	@ViewChild('myname',  {static: false}) elem:ElementRef;	
	customOptions: OwlOptions = {
		loop: true,
		mouseDrag: true,
		touchDrag: false,
		pullDrag: false,
		dots: true,
		navSpeed: 700,
		navText: ['', ''],
		responsive: {
		  0: {
			items: 1
		  },
		  940: {
			items: 3
		  }
		},
		margin:30,
		nav: true
	}
	
	/*config: any = {
		// Optional parameters
		loop: true,
		preventClicks: false,
		preventClicksPropagation: false,
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
	config2: any = {

		loop: true,



	};
	config3: any = {

		loop: true,

		pagination: {
		  el: '.swiper-pagination3',
		  clickable: true
		},


		navigation: {
		  nextEl: '.swiper-button-next3',
		  prevEl: '.swiper-button-prev3',
		},

	};*/
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
		private elRef:ElementRef
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

	openCoop( coop) {	  
		console.log('coop modal');
		//console.log(coop);
		this.singleCoop = coop;
		this.modalService.open(
			this.coopModal, 
			{
				ariaLabelledBy: 'modal-basic-title', 
				size: 'lg', 
				backdropClass: 'fullscrenn-backdrop',
				//backdrop: 'static',
				windowClass: 'fullscrenn-modal',
			}
		).result.then((result) => {
			console.log('closed');

			}, (reason) => {
				console.log('dismissed');

		});
	}

	ngAfterViewInit() {
		const interval = setInterval(() => {
			const condition = this.elRef.nativeElement.querySelector('.swiper-slide');
			console.log('-');
			if (condition) {
			  this.elRef.nativeElement.querySelector('.swiper-slide').addEventListener('click', this.openCoop.bind(this));
			  console.log('added!!!!!!!!');
			  clearInterval(interval) 
			}
		  }, 100); 
	}


	mousedown() {
	  this.moved = false;
	}
	mousemove() {
	  this.moved = true;
	}

	mouseup(coop) {
		if (this.moved) {
			console.log('moved')
		} else {
			console.log('not moved');
			this.openCoop( coop);
		}
		this.moved = false;
	}
  
}