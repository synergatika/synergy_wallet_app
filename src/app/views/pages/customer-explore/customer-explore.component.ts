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
		  600: {
			items: 2
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
				//Temp for DEMO
				if(this.posts.length<3){
					this.posts.push(this.posts[0]);
					this.posts.push(this.posts[0]);
				}
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


	//Open Post
	openPost(post) {	  
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
	}

	//Actions to Open Modals from Carousel
	mousedown() {
	  this.moved = false;
	}
	mousemove() {
	  this.moved = true;
	}
	mouseup(data, type) {
		if (this.moved) {
			//Do nothings
		} else {
			if(type == 'coop') {
				this.openCoop(data);
			} else if(type=='post'){
				this.openPost(data);
			}else{
				//Do nothing
			}
		}
		this.moved = false;
	}
  
}