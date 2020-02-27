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
	//Set Basic Variables
	moved;
	private unsubscribe: Subject<any>;
	loading: boolean = false;

	//Set Content Variables
	merchants: any;
	posts: any;
	offers: any;
	events: any;
	singleOffers: any;
	singleMicrocredit: any;
	singleCoop: any;
	singlePost: any;

	//Set Child Modals
	@ViewChild('coopModal', {static: false}) coopModal;
	@ViewChild('postModal', {static: false}) postModal;
	
	//@ViewChild('myname',  {static: false}) elem:ElementRef;	
	
	//hours = ["Δευτέρα, Τρίτη, Πέμπτη, Παρασκευή 9.00-21.00","Τετάρτη 9.00-16.00","Σάββατο 10.00-16.00"];
	
	//Slider Options
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
		//Get Lists Data
		this.fetchMerchantsData();
		this.fetchOffersData();
		this.fetchPostsEventsData();	
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	* Assets Function On init
	*/

	//Get Merchants
	fetchMerchantsData() {
		this.merchantsService.readMerchants()
		  .pipe(
			tap(
			  data => {
				this.merchants = data;
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


	//Get Posts & Events
	fetchPostsEventsData() {
		this.itemsService.readAllPublicPostsEvents()
		  .pipe(
			tap(
			  data => {
				this.posts = data;
				//console.log("all posts");
				//console.log(this.posts)
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

	//Get Offers
	fetchOffersData() {
		this.itemsService.readAllOffers()
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
	

	/*
	/ Modals
	*/

	//Open Coop
	openCoop(coop) {	  
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


	/*
	fetchPostsData() {
		this.itemsService.readAllPrivatePosts()
		  .pipe(
			tap(
			  data => {
				this.posts = data;
				console.log("all posts");
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
		
	fetchSingleOffersData(merchant_id) {
		this.singleOffers = null;
		this.itemsService.readOffersByStore(merchant_id)
		  .pipe(
			tap(
			  data => {
				console.log("single offers");
				console.log(data);
				this.singleOffers = data;
			  },
			  error => {
			  }),
			finalize(() => {
			  this.loading = false;
			  this.cdRef.markForCheck();
			})
		  )
		  .subscribe();
	}

	fetchSinglePostsData(merchant_id) {
		this.itemsService.readPrivatePostsByStore(merchant_id)
		  .pipe(
			tap(
			  data => {
				console.log(data);
				this.posts = data;
			  },
			  error => {
			  }),
			finalize(() => {
			  this.loading = false;
			  this.cdRef.markForCheck();
			})
		  )
		  .subscribe();
	}
	*/
	
	/*
	openCoop( coop) {	  
		console.log('coop modal');
		//console.log(coop);
		this.singleCoop = coop;
		this.fetchSingleOffersData(coop._id);
		//this.singleMicrocredit = [this.list.find(x => x.coop_id === coop._id)];
		this.singleMicrocredit = this.list;
		console.log(this.singleMicrocredit);
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

	openPost(post) {	  
		console.log('post modal');
		console.log(post);
		this.singlePost = post;
		this.modalService.open(
			this.postModal, 
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
	}*/
	
	ngAfterViewInit() {
		/*const interval = setInterval(() => {
			const condition = this.elRef.nativeElement.querySelector('.swiper-slide');
			console.log('-');
			if (condition) {
			  this.elRef.nativeElement.querySelector('.swiper-slide').addEventListener('click', this.openCoop.bind(this));
			  console.log('added!!!!!!!!');
			  clearInterval(interval) 
			}
		  }, 100); */
	}

	mousedown() {
	  this.moved = false;
	}
	
	mousemove() {
	  this.moved = true;
	}

	mouseup(data, type) {
		if (this.moved) {
			console.log('moved')
		} else {
			console.log('not moved');
			if(type == "coop") {
				this.openCoop(data);
			} else {
				//this.openPost(data);
			}
		}
		this.moved = false;
	}
	
  
}