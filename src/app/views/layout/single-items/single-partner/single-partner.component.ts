import { Input, Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';

/**
 * Services
 */
import { StaticDataService } from 'src/app/core/services/static-data.service';
import { ItemsService } from '../../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { Partner } from 'src/app/core/models/partner.model';
import { PostEvent } from 'src/app/core/models/post_event.model';
import { Offer } from 'src/app/core/models/offer.model';
import { MicrocreditCampaign } from 'src/app/core/models/microcredit_campaign.model';

@Component({
	selector: 'app-single-partner',
	templateUrl: './single-partner.component.html',
	styleUrls: ['./single-partner.component.scss']
})
export class SinglePartnerComponent implements OnInit, OnDestroy {

	/**
	 * Children Modals
	 */
	@ViewChild('campaignModal', { static: false }) campaignModal: NgbModal;
	@ViewChild('postModal', { static: false }) postModal: NgbModal;

	/**
	 * Imported Variables
	 */
	@Input() partner: Partner;

	/**
	 * Content Variables
	 */
	public singleOffers: Offer[];
	public singlePosts: PostEvent[]; //Used to store posts
	public singlePost: PostEvent; //Used for the post to open in modal
	public singleMicrocredits: MicrocreditCampaign[]; //Used to store microcredits
	public singleMicrocredit: MicrocreditCampaign; //Used for the Microcreit to open in modal

	/**
	 * Carousel Variables
	 */
	customOptions: OwlOptions;
	moved: boolean;

	private unsubscribe: Subject<any>;
	loading: boolean = false;

	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param modalService: NgbModal
	 * @param staticDataService: StaticDataService
	 * @param itemsService: ItemsService
	 */
	constructor(
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private staticDataService: StaticDataService,
		private itemsService: ItemsService,
	) {
		this.customOptions = this.staticDataService.getOwlOptionsTwo;
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchSingleMicrocreditsData(this.partner._id);
		this.fetchSingleOffersData(this.partner._id);
		this.fetchSinglePostEventsData(this.partner._id);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}


	/**
	  * Close Modal on Browser Back Button 
	  */
	// controlModalState(state: boolean) {
	// 	if (state) {
	// 		const modalState = {
	// 			extra_modal: true,
	// 			desc: 'SinglePartnerModals'
	// 		};
	// 		history.pushState(modalState, null);
	// 	} else {
	// 		if (window.history.state.extra_modal) {
	// 			history.back();
	// 		}
	// 	}
	// }

	/**
	 * Fetch Microcredit Campaigns List (for One Partner)
	 */
	fetchSingleMicrocreditsData(partner_id: string) {
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

	/**
	 * Fetch Offers List (for One Partner)
	 */
	fetchSingleOffersData(partner_id: string) {
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

	/**
	 * Fetch Post & Events List (for One Partner)
	 */
	fetchSinglePostEventsData(partner_id: string) {
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


	/**
	 * Open Microcredit Campaign Modal
	 */
	openMicrocredit(campaign: MicrocreditCampaign) {
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
		).result.then(
			(result) => { console.log('closed'); },
			(reason) => { console.log('dismissed'); });
	}


	/**
	 * Open PostEvent Modal
	 */
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
		).result.then(
			(result) => { console.log('closed'); },
			(reason) => { console.log('dismissed'); });
	}


	/**
	 * Actions to Open Modals from Carousel
	 */
	mousedown() { this.moved = false; }
	mousemove() { this.moved = true; }
	mouseup(data: any, type: string) {
		if (this.moved) { }
		else {
			if (type == 'microcredit') {
				this.openMicrocredit(data);
			} else if (type == 'post') {
				this.openPost(data);
			} else { }
		}
		this.moved = false;
	}
}
