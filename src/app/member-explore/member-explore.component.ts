import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

/**
 * Environment
 */
import { environment } from '../../environments/environment';

/**
 * Services
 */
import { StaticDataService } from '../core/services/static-data.service';
import { PartnersService } from '../core/services/partners.service';
import { ItemsService } from '../core/services/items.service';

/**
 * Models & Interfaces
 */
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

	/**
	 * Children Modals
	 */
	@ViewChild('partnerModal', { static: false }) partnerModal: NgbModal;
	@ViewChild('postModal', { static: false }) postModal: NgbModal;

	/**
	 * Configuration and Static Data
	 */
	public configAccess: Boolean[] = environment.access;

	/**
	 * Carousel Variables
	 */
	customOptions: OwlOptions;
	moved: boolean;

	/**
	 * Content Variables
	 */
	public partners: Partner[];
	public posts: PostEvent[];
	singlePartner: Partner;
	singlePost: PostEvent;
	//offers: Offer[];
	//events: Event[];
	//currentOpenModal: NgbModalRef;

	//singleOffers: Offer;
	//singleMicrocredit: MicrocreditCampaign;

	private unsubscribe: Subject<any>;
	loading: boolean = false;

	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param modalService: NgbModal
	 * @param translate: TranslateService
	 * @param staticDataService: StaticDataService
	 * @param loyaltyService: LoyaltyService
	 * @param microcreditService: MicrocreditService
	 * @param contentService: ContentService
	 */
	constructor(
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		public translate: TranslateService,
		private staticDataService: StaticDataService,
		private partnersService: PartnersService,
		private itemsService: ItemsService,
	) {
		this.customOptions = this.staticDataService.getOwlOptionsThree;
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchPartnersData();
		this.fetchPostsEventsData();
	}

	/**
	 * On Destory
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Close Modal on Browser Back Button 
	 */
	controlModalState(state: boolean) {
		if (state) {
			const modalState = {
				modal: true,
				desc: 'MemberExploreModals'
			};
			history.pushState(modalState, null);
		} else {
			if (window.history.state.modal) {
				history.back();
			}
		}
	}

	@HostListener('window:popstate')
	dismissModal() {
		if (this.modalService.hasOpenModals()) {
			this.modalService.dismissAll();
			this.controlModalState(false);
		}

	}

	/**
	 * Fetch Partners List
	 */
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


	/**
	 * Fetch Post & Events List
	 */
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

	/**
	 * Randomize Data
	 */
	shuffle(array: Partner[]) {
		return array.sort(() => Math.random() - 0.5);
	}

	/**
	 * Open Partner Modal
	 */
	openPartner(partner: Partner) {
		this.singlePartner = partner;
		this.controlModalState(true);
		this.modalService.open(
			this.partnerModal,
			{
				ariaLabelledBy: 'modal-basic-title',
				size: 'lg',
				backdropClass: 'fullscrenn-backdrop',
				//backdrop: 'static',
				windowClass: 'fullscreen-modal',
			}
		)
			.result.then(
				(result) => { this.controlModalState(false); console.log('closed'); },
				(reason) => { this.controlModalState(false); console.log('dismissed'); });
	}

	/**
	 * Open PostEvent Modal
	 */
	openPost(post: PostEvent) {
		this.singlePost = post;
		this.controlModalState(true);
		this.modalService.open(
			this.postModal,
			{
				ariaLabelledBy: 'modal-basic-title',
				size: 'lg',
				backdropClass: 'fullscrenn-backdrop',
				//backdrop: 'static',
				windowClass: 'fullscreen-modal',
			}
		)
			.result.then(
				(result) => { this.controlModalState(false); console.log('closed'); },
				(reason) => { this.controlModalState(false); console.log('dismissed'); });
	}

	/**
	 * Actions to Open Modals from Carousel
	 */
	mousedown() { this.moved = false; }
	mousemove() { this.moved = true; }
	mouseup(data: any, type: string) {
		if (this.moved) { }
		else {
			if (type == 'partner') {
				this.openPartner(data);
			} else if (type == 'post') {
				this.openPost(data);
			} else { }
		}
		this.moved = false;
	}
}