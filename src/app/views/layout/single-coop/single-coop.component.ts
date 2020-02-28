import { Input, Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { OwlOptions } from 'ngx-owl-carousel-o';

import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-single-coop',
	templateUrl: './single-coop.component.html',
	styleUrls: ['./single-coop.component.scss']
})
export class SingleCoopComponent implements OnInit, OnDestroy {

	//Set Basic Variables
	moved;
	private unsubscribe: Subject<any>;
	loading: boolean = false;
	//Set Variables Imported
	@Input() singleCoop: any;
	//Set Content Variables
	singleOffers: any;
	singlePosts: any; //Used to store posts
	singlePost:any; //Used for the post to open in modal
	singleMicrocredits:any; //Used to store microcredits
	singleMicrocredit:any; //Used for the Microcreit to open in modal

	//Set Child Modals
	@ViewChild('campaignModal', { static: false }) campaignModal;
	@ViewChild('postModal', { static: false }) postModal;

	//Slider Options
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
				items: 3
			}
		},
		margin: 30,
		nav: true
	};

	constructor(
		private cdRef: ChangeDetectorRef,
		private itemsService: ItemsService,
		private modalService: NgbModal,
		private elRef: ElementRef
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		//Get Microcredits of Coop
		this.fetchSingleMicrocreditsData(this.singleCoop._id);
		//Get Offers of Coop
		this.fetchSingleOffersData(this.singleCoop._id);
		//Get Post & Events of Coop
		this.fetchSinglePostEventsData(this.singleCoop._id);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	* Assets Function On init
	*/

	//Get Microcredit Campaigns of Coop
	fetchSingleMicrocreditsData(merchant_id) {
		this.singleMicrocredits = null;
		this.itemsService.readPublicMicrocreditCampaignsByStore(merchant_id)
			.pipe(
				tap(
					data => {
						this.singleMicrocredits = data;
					},
					error => {
						console.log(error);
					}),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}

	//Get Offers of Coop
	fetchSingleOffersData(merchant_id) {
		this.singleOffers = null;
		this.itemsService.readOffersByStore(merchant_id)
			.pipe(
				tap(
					data => {
						this.singleOffers = data;
					},
					error => {
						console.log(error);
					}),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}

	//Get Post & Events of Coop
	fetchSinglePostEventsData(merchant_id) {
		this.singlePosts = null;
		this.itemsService.readPublicPostsEventsByStore(merchant_id)
			.pipe(
				tap(
					data => {
						this.singlePosts = data;
					},
					error => {
						console.log(error);
					}),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}


	/*
	/* Modals
	*/

	//Open Microcredit
	openMicrocredit(campaign) {	 
		console.log("test");
		this.singleMicrocredit = campaign;
		this.modalService.open(
			this.campaignModal, 
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
			if (type == 'microcredit') {
				console.log("tes0t");
				this.openMicrocredit(data);
			} else if (type == 'post') {
				this.openPost(data);
			} else {
				//Do nothings
			}
		}
		this.moved = false;
	}

}
