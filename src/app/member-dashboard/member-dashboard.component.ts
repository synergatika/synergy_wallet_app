//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

/**
 * Environment
 */
import { environment } from '../../environments/environment';

/**
 * Services
 */
import { StaticDataService } from '../core/services/static-data.service';
import { ContentService } from 'src/app/core/services/content.service';
import { LoyaltyService } from '../core/services/loyalty.service';
import { MicrocreditService } from 'src/app/core/services/microcredit.service';

/**
 * Models & Interfaces
 */
import { Activity } from '../core/models/activity.model';
import { Balance } from '../core/interfaces/balance.interface';
import { MicrocreditSupport } from '../core/models/microcredit_support.model';
import { PaymentList } from '../core/interfaces/payment-list.interface';

@Component({
	selector: 'app-member-dashboard',
	templateUrl: './member-dashboard.component.html',
	styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit, OnDestroy {

	/**
	 * Children Modals
	 */
	@ViewChild('qrcodeModal', { static: false }) qrcodeModal: NgbModalRef;
	@ViewChild('walletModal', { static: false }) walletModal: NgbModalRef;
	@ViewChild('supportsModal', { static: false }) supportsModal: NgbModalRef;

	/**
	 * Configuration and Static Data
	 */
	public configAccess: Boolean[] = environment.access;
	public paymentsList: PaymentList[];
	//Set Basic Variables
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public loyalty_badge: Activity; //The loyalty badge of member
	public microcredit_badge: Activity;
	public balance: Balance; //The loyalty badge of member
	public qrcode: any; //The loyalty badge of member

	//Set Content Variables
	Text: any; //Static Text for QR Code Modal
	public supportsList: MicrocreditSupport[]; //The microcredits the member supports
	public supportItem: MicrocreditSupport; //Currently Selected microcredit Support
	//offers: Offer[]; //Available Offers

	p: number = 1;

	//Set Badges Icons
	badgesImages = {
		supporter: '../../../assets/media/images/ranking-1.png',
		helper: '../../../assets/media/images/ranking-2.png',
		one_of_us: '../../../assets/media/images/ranking-3.png',
	};

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
		private loyaltyService: LoyaltyService,
		private microcreditService: MicrocreditService,
		private contentService: ContentService
	) {
		this.paymentsList = this.staticDataService.getPaymentsList;
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchLoyaltyBadgeData();
		this.fetchMicrocreditBadgeData();
		this.fetchBalanceData();
		this.fetchSupportsData();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy(): void {
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
				desc: 'MemberDashboardModals'
			};
			history.pushState(modalState, null);
		} else {
			if (window.history.state.modal) {
				history.back();
			}
		}
	}

	@HostListener('window:popstate', ['$event'])
	dismissModal() {
		if (this.modalService.hasOpenModals()) {
			this.modalService.dismissAll();
			this.controlModalState(false);
		}
	}

	/**
	 * Fetch Loyalty Badge
	 */
	fetchLoyaltyBadgeData() {
		this.loyaltyService.readBadge()
			.pipe(
				tap(
					data => {
						this.loyalty_badge = data;
						console.log("Badge");
						console.log(data);
						//Set Data for Badge based On Level
						switch (this.loyalty_badge.slug) {
							case 1:
								this.loyalty_badge.image = this.badgesImages.supporter;
								//this.badge.text_id = 5;
								this.loyalty_badge.text_id = 'Supporter';
								break;
							case 2:
								this.loyalty_badge.image = this.badgesImages.helper;
								//this.badge.text_id = 7;
								this.loyalty_badge.text_id = 'Helper';
								break;
							case 3:
								this.loyalty_badge.image = this.badgesImages.one_of_us;
								//this.badge.text_id = 9;
								this.loyalty_badge.text_id = 'One of Us';
								break;
						}
						//Get static content of Badge
						this.contentService.readContentById(this.loyalty_badge.text_id)
							//this.staticContentService.readText(this.badge.text_id)
							.pipe(
								tap(
									data => {
										this.loyalty_badge.text = data;
										console.log(this.translate.currentLang)
									},
									error => {
										console.log(error);
									}
								),
								takeUntil(this.unsubscribe),
								finalize(() => {
									this.loading = false;
									this.cdRef.markForCheck();
								})
							).subscribe();
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
	 * Fetch Microcredit Badge
	 */
	fetchMicrocreditBadgeData() {
		this.microcreditService.readBadge()
			.pipe(
				tap(
					data => {
						this.microcredit_badge = data;
						console.log(data);
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
	 * Fetch Loyalty Balance
	 */
	fetchBalanceData() {
		this.loyaltyService.readBalance()
			.pipe(
				tap(
					data => {
						this.balance = { points: parseInt(data.points, 16), address: data.address };
						//Get static content of Balance Points
						console.log(this.balance)
						this.contentService.readContentById('Synergy Points')
							//this.staticContentService.readText('18')
							.pipe(
								tap(
									data => {
										this.balance['text'] = data;
										console.log(this.balance);
									},
									error => {
										console.log(error);
									}
								),
								takeUntil(this.unsubscribe),
								finalize(() => {
									this.loading = false;
									this.cdRef.markForCheck();
								})
							).subscribe();
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
	 * Fetch Supports History
	 */
	fetchSupportsData() {
		this.microcreditService.readAllBackerSupports('0-0-1')
			.pipe(
				tap(
					data => {
						this.supportsList = data;
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
	 * Open QR Modal
	 */
	openQrcode() {
		//Open the QR code Modal
		this.controlModalState(true);
		this.modalService.open(this.qrcodeModal)
			.result.then(
				(result) => { this.controlModalState(false); console.log('closed'); },
				(reason) => { this.controlModalState(false); console.log('dismissed'); });

		//Get static content of Balance Points
		this.contentService.readContentById('QR Code')
			.pipe(
				tap(
					data => {
						this.qrcode = { text: data };
					},
					error => {
						console.log(error);
					}
				),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			).subscribe();
	}

	/**
	 * Open Wallet Modal
	 */
	openWallet() {
		this.controlModalState(true);
		this.modalService.open(this.walletModal)
			.result.then(
				(result) => { this.controlModalState(false); console.log('closed'); },
				(reason) => { this.controlModalState(false); console.log('dismissed'); });
	}

	/**
	 * Open Support Modal
	 */
	openSupportItem(supportItemTemp) {

		this.supportItem = {
			...supportItemTemp,
			status: (supportItemTemp.initalTokens == supportItemTemp.redeemedTokens) ? 'completed' : supportItemTemp.status,
			how: (supportItemTemp.method == 'store') ? {} : {
				title: this.paymentsList.filter((el) => {
					return el.bic == supportItemTemp.method
				})[0].title,
				value: supportItemTemp.partner_payments.filter((el) => {
					return el.bic == supportItemTemp.method
				})[0].value
			}
		};

		this.controlModalState(true);
		this.modalService.open(this.supportsModal)
			.result.then(
				(result) => { this.controlModalState(false); console.log('closed'); },
				(reason) => { this.controlModalState(false); console.log('dismissed'); });
	}
}