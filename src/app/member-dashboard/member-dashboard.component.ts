//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//Import System Services

import { MicrocreditSupport } from '../core/models/microcredit_support.model';
import { AuthenticationService } from '../core/services/authentication.service';
import { StaticContentService } from '../core/services/staticcontent.service';
import { ItemsService } from '../core/services/items.service';
import { LoyaltyService } from '../core/services/loyalty.service';
import { MicrocreditService } from 'src/app/core/services/microcredit.service';
import { ContentService } from 'src/app/core/services/content.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { StaticDataService } from '../core/services/static-data.service';

@Component({
	selector: 'app-member-dashboard',
	templateUrl: './member-dashboard.component.html',
	styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit, OnDestroy {

	public configAccess: Boolean[] = environment.access;
	public paymentsList: any[];

	//Set Basic Variables
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public loyalty_badge: any; //The loyalty badge of member
	public microcredit_badge: any;
	public balance: any; //The loyalty badge of member
	public qrcode: any; //The loyalty badge of member

	//Set Content Variables
	Text: any; //Static Text for QR Code Modal
	supportsList: MicrocreditSupport[]; //The microcredits the member supports
	supportItem: MicrocreditSupport; //Currently Selected microcredit Support
	offers: any; //Available Offers

	//Set Badges Icons
	badgesImages = {
		supporter: '../../../assets/media/images/ranking-1.png',
		helper: '../../../assets/media/images/ranking-2.png',
		one_of_us: '../../../assets/media/images/ranking-3.png',
	};

	//Set Child Modals
	@ViewChild('qrcodeModal', { static: false }) qrcodeModal;
	@ViewChild('walletModal', { static: false }) walletModal;
	@ViewChild('supportsModal', { static: false }) supportsModal;

	/**
   * Component constructor
   *
   * @param cdRef: ChangeDetectorRef
   * @param authenticationService: AuthenticationService
   * @param loyaltyService: LoyaltyService
   */
	constructor(
		private cdRef: ChangeDetectorRef,
		private authenticationService: AuthenticationService,
		private modalService: NgbModal,
		private loyaltyService: LoyaltyService,
		private staticContentService: StaticContentService,
		public translate: TranslateService,
		private itemsService: ItemsService,
		private microcreditService: MicrocreditService,
		private contentService: ContentService,
		private staticDataService: StaticDataService
	) {
		this.paymentsList = this.staticDataService.getPaymentsList;
		this.unsubscribe = new Subject();
	}

	/**
	* On Init
	*/
	ngOnInit() {
		//Get Badge
		this.fetchLoyaltyBadgeData();
		this.fetchMicrocreditBadgeData();
		//Get Wallet Data
		this.fetchBalanceData();
		this.fetchSupportsData();
		//Get Offers Data
		this.fetchOffersData();
	}


	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	* Assets Function On Init
	*/

	//Get the Badge of the Member
	fetchLoyaltyBadgeData() {
		this.loyaltyService.readBadge()
			.pipe(
				tap(
					data => {
						this.loyalty_badge = data;
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

	//Get the Balance of the Member
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

	//Get the Offers
	fetchOffersData() {
		this.itemsService.readAllOffers('0-0-0')
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

	//Get the Mircoredit the Member supports
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
	* Modal Functions
	*/
	openQrcode() {
		//Open the QR code Modal
		this.modalService.open(this.qrcodeModal).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
		//Get static content of Balance Points
		this.contentService.readContentById('QR Code')
			//this.staticContentService.readText('23')
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
	openWallet() {
		this.modalService.open(this.walletModal).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
	}
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
		this.modalService.open(this.supportsModal).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
	}
}