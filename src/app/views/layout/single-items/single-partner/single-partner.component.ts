import { Input, Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { ItemsService } from '../../../../core/services/items.service';

import { Partner } from 'src/app/core/models/partner.model';
import { Offer } from 'src/app/core/models/offer.model';
import { MicrocreditCampaign } from 'src/app/core/models/microcredit_campaign.model';
import { PostEvent } from 'src/app/core/models/post_event.model';
import { StaticDataService } from 'src/app/core/services/static-data.service';

@Component({
	selector: 'app-single-partner',
	templateUrl: './single-partner.component.html',
	styleUrls: ['./single-partner.component.scss']
})
export class SinglePartnerComponent implements OnInit, OnDestroy {

	// Set Child Modals
	@ViewChild('campaignModal', { static: false }) campaignModal: NgbModal;
	@ViewChild('postModal', { static: false }) postModal: NgbModal;
	// Set Variables Imported
	@Input() partner: Partner;


	//Set Basic Variables
	moved: boolean;
	private unsubscribe: Subject<any>;
	loading: boolean = false;

	//Set Content Variables
	singleOffers: Offer[];
	singlePosts: PostEvent[]; //Used to store posts
	singlePost: PostEvent; //Used for the post to open in modal
	singleMicrocredits: MicrocreditCampaign[]; //Used to store microcredits
	singleMicrocredit: MicrocreditCampaign; //Used for the Microcreit to open in modal
	//hours: any;



	//Slider Options
	customOptions: OwlOptions;

	constructor(
		private cdRef: ChangeDetectorRef,
		private itemsService: ItemsService,
		private modalService: NgbModal,
		private elRef: ElementRef,
		private staticDataService: StaticDataService,
	) {
		this.customOptions = this.staticDataService.getOwlOptionsTwo;
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		//Get Microcredits of Coop
		this.fetchSingleMicrocreditsData(this.partner._id);
		//Get Offers of Coop
		this.fetchSingleOffersData(this.partner._id);
		//Get Post & Events of Coop
		this.fetchSinglePostEventsData(this.partner._id);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	* Assets Function On Init
	*/

	//Get Microcredit Campaigns of Coop
	fetchSingleMicrocreditsData(partner_id) {
		this.singleMicrocredits = null;
		this.itemsService.readPrivateMicrocreditCampaignsByStore(partner_id, '0-0-1')
			.pipe(
				tap(
					data => {
						this.singleMicrocredits = data;
						//TEMP FOR DEMO
						if (this.singleMicrocredits.length && this.singleMicrocredits.length < 3) {
							this.singleMicrocredits.push(this.singleMicrocredits[0]);
							this.singleMicrocredits.push(this.singleMicrocredits[0]);
						}
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
	fetchSingleOffersData(partner_id) {
		this.singleOffers = null;
		this.itemsService.readOffersByStore(partner_id, '0-0-1')
			.pipe(
				tap(
					data => {
						this.singleOffers = data;
						//TEMP FOR DEMO
						if (this.singleOffers.length && this.singleOffers.length < 3) {
							this.singleOffers.push(this.singleOffers[0]);
							this.singleOffers.push(this.singleOffers[0]);
						}
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
	fetchSinglePostEventsData(partner_id) {
		this.singlePosts = null;
		this.itemsService.readPrivatePostsEventsByStore(partner_id, '0-0-0')
			.pipe(
				tap(
					data => {
						this.singlePosts = data;
						//TEMP FOR DEMO
						if (this.singlePosts.length && this.singlePosts.length < 3) {
							this.singlePosts.push(this.singlePosts[0]);
							this.singlePosts.push(this.singlePosts[0]);
						}
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
		this.singleMicrocredit = campaign;
		this.modalService.open(
			this.campaignModal,
			{
				ariaLabelledBy: 'modal-basic-title',
				size: 'lg',
				backdropClass: 'fullscrenn-backdrop',
				//backdrop: 'static',
				windowClass: 'fullscreen-modal',
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
				windowClass: 'fullscreen-modal',
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
