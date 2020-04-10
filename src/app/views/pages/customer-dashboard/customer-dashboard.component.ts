//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//Import System Services
import { AuthenticationService } from '../../../core/services/authentication.service';
import { StaticContentService } from '../../../core/services/staticcontent.service';
import { ItemsService } from '../../../core/services/items.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { MicrocreditService } from 'src/app/core/services/microcredit.service';
import { ContentService } from 'src/app/core/services/content.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
	selector: 'app-customer-dashboard',
	templateUrl: './customer-dashboard.component.html',
	styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

	//Set Basic Variables
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public badge: any; //The loyalty badge of customer
	public balance: any; //The loyalty badge of customer
	public qrcode: any; //The loyalty badge of customer

	//Set Content Variables
	Text: any; //Static Text for QR Code Modal
	supportsList: any; //The microcredits the customer supports
	supportItem: any; //Currently Selected microcredit Support
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
	) {
		this.unsubscribe = new Subject();
	}

	/**
	* On Init
	*/
	ngOnInit() {
		//Get Badge
		this.fetchBadgeData();
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

	//Get the Badge of the Customer
	fetchBadgeData() {
		this.loyaltyService.readBadge()
			.pipe(
				tap(
					data => {
						this.badge = data;
						//Set Data for Badge based On Level
						switch (this.badge.slug) {
							case 1:
								this.badge.image = this.badgesImages.supporter;
								//this.badge.text_id = 5;
								this.badge.text_id = 'Supporter';
								break;
							case 2:
								this.badge.image = this.badgesImages.helper;
								//this.badge.text_id = 7;
								this.badge.text_id = 'Helper';
								break;
							case 3:
								this.badge.image = this.badgesImages.one_of_us;
								//this.badge.text_id = 9;
								this.badge.text_id = 'One of Us';
								break;
						}
						//Get static content of Badge
						this.contentService.readContentById(this.badge.text_id)
							//this.staticContentService.readText(this.badge.text_id)
							.pipe(
								tap(
									data => {
										this.badge.text = data;
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

	//Get the Balance of the Customer
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

	//Get the Mircoredit the Customer supports
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
		this.supportItem = supportItemTemp;
		this.modalService.open(this.supportsModal).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
	}
}