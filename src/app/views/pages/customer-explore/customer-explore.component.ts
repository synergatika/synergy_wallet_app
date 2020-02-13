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
	singlePost: any;
	@ViewChild('myname',  {static: false}) elem:ElementRef;	
	hours = ["Δευτέρα, Τρίτη, Πέμπτη, Παρασκευή 9.00-21.00","Τετάρτη 9.00-16.00","Σάββατο 10.00-16.00"];
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
	customOptionsSingle: OwlOptions = {
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
		  740: {
			items: 2
		  }
		},
		margin:30,
		nav: true
	}
	list = [
		{
			id: "Commonspace34533",
			title: "Ζαπατίστικος Καφές",
			desc: "Έχοντας προαγοράσει Ζαπατίστικο Καφέ μας βοηθάς να τον εισάγουμε απευθείας από την Τσιάπας χωρίς μεσάζοντες.",
			coop_id: "5e1148f4752f39d6d493740b",
			begins: "1.5.2020",
			expires: "4.6.2020",
			points: "50",
			price_reduced: "160",
			price_initial: "200",
			img: './assets/media/images/syballis-micro-humbnail.jpg',
			microcredit_num: '3767',
			address: 'Nileos 35, 11851, Athens',
			op_hours: '09:00-15:00',
			phone: '2103606333'
		},
		{
			id: "Ekdoseis3d76r3",
			title: "Ετήσια Βιβλιοσυνδρομή",
			coop_id: "5e11406b752f391bb4937407",
			expires: "March 15, 2020",
			points: "55",
			price_reduced: "80",
			price_initial: "140",
			img: './assets/media/images/ekdoseis.png',
			microcredit_num: '3768',
			address: 'Akakiou 1 - 3 & Ipeirou 60, 10439, Athens',
			op_hours: '09:00-19:00',
			phone: '2103606333'
		},
	];	
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
	singleOffers: any;
	singleMicrocredit: any;
	@ViewChild('coopModal', {static: false}) coopModal;
	@ViewChild('postModal', {static: false}) postModal;
	
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
				console.log("all merchants");
				console.log(this.merchants);
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

	fetchOffersData() {
		this.itemsService.readAllOffers()
		  .pipe(
			tap(
			  data => {
				this.offers = data;
				console.log("all offers");
				console.log(this.offers);
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
	}
	
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
				this.openPost(data);
			}
		}
		this.moved = false;
	}
	
  
}