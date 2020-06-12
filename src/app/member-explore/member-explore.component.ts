import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { PartnersService } from '../core/services/partners.service';
import { ItemsService } from '../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '../../environments/environment';
import { Partner } from '../core/models/partner.model';
import { Offer } from '../core/models/offer.model';
import { PostEvent } from '../core/models/post_event.model';
import { MicrocreditCampaign } from '../core/models/microcredit_campaign.model';

@Component({
	selector: 'app-member-explore',
	templateUrl: './member-explore.component.html',
	styleUrls: ['./member-explore.component.scss']
})
export class MemberExploreComponent implements OnInit, OnDestroy {

	public configAccess: Boolean[] = environment.access;

	//Set Basic Variables 
	moved;
	private unsubscribe: Subject<any>;
	loading: boolean = false;

	//Set Content Variables
	partners: Partner[];
	posts: PostEvent[];
	offers: Offer[];
	//events: Event[];

	singleOffers: Offer;
	singleMicrocredit: MicrocreditCampaign;
	singlePartner: Partner;
	singlePost: PostEvent;

	//Set Child Modals
	@ViewChild('partnerModal', { static: false }) partnerModal;
	@ViewChild('postModal', { static: false }) postModal;

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
		margin: 30,
		nav: true
	}

	constructor(
		private cdRef: ChangeDetectorRef,
		private partnersService: PartnersService,
		private itemsService: ItemsService,
		private modalService: NgbModal,
		private elRef: ElementRef
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		//Get Lists Data
		this.fetchPartnersData();
		this.fetchOffersData();
		this.fetchPostsEventsData();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Randomize
	 */
	shuffle(array: Partner[]) {
		return array.sort(() => Math.random() - 0.5);
	}

	/**
	* Assets Function On Init
	*/

	//Get Partners
	fetchPartnersData() {
		this.partnersService.readPartners('0-0-0')
			.pipe(
				tap(
					data => {
						this.partners = this.shuffle(data);
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
		this.itemsService.readAllPrivatePostsEvents('0-0-0')
			.pipe(
				tap(
					data => {
						this.posts = data;
						//Temp for DEMO
						if (this.posts.length < 3) {
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
		this.itemsService.readAllOffers('0-0-0')
			.pipe(
				tap(
					data => {
						this.offers = data;
						if (this.offers.length < 3) {
							this.offers.push(this.offers[0]);
							this.offers.push(this.offers[0]);
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


	/*
	/ Modals
	*/

	//Open Coop
	openPartner(partner: Partner) {
		this.singlePartner = partner;
		this.modalService.open(
			this.partnerModal,
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
	openPost(post: PostEvent) {
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
			if (type == 'partner') {
				this.openPartner(data);
			} else if (type == 'post') {
				this.openPost(data);
			} else {
				//Do nothing
			}
		}
		this.moved = false;
	}

}