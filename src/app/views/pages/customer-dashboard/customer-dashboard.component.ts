//Import Basic Services
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';
import { AuthNotice } from 'src/app/core/helpers/auth-notice/auth-notice.interface';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//Import System Services
import { AuthenticationService } from '../../../core/services/authentication.service';
import { StaticContentService } from '../../../core/services/staticcontent.service';
import { ItemsService } from '../../../core/services/items.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { MicrocreditService } from 'src/app/core/services/microcredit.service';


@Component({
	selector: 'app-customer-dashboard',
	templateUrl: './customer-dashboard.component.html',
	styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

	//Set Basic Variables
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	//Set Content Variables
	balance: number = 0; //The points balance of customer
	badge: any ; //The loyalty badge of customer
	supports: any; //The microcredits the customer supports
	offers: any; //Available Offers
	microcredit: any; //Microcredit content (used in Modal)

	//Set Badges Icons
	badgesImages = {
		supporter: '../../../assets/media/images/ranking-1.png',
		helper: '../../../assets/media/images/ranking-2.png',
		one_of_us: '../../../assets/media/images/ranking-3.png',
	};

	//Demo Content
	list = [
		{
			id: "Commonspace34533",
			title: "Ζαπατίστικος Καφές",
			desc: "Έχοντας προαγοράσει Ζαπατίστικο Καφέ μας βοηθάς να τον εισάγουμε απευθείας από την Τσιάπας χωρίς μεσάζοντες.",
			coop_id: "Synallois14234562456",
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
			coop_id: "Ekdoseis34562456",
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
	coops = {
		"Synallois14234562456": {
			"id": "Synallois14234562456",
			"name": "Συν Άλλοις",
			"img": "./assets/media/images/uploaded/commonspace.webp",
			"sector": "Recreation and Culture",
			"subscription_date": "Jan 5, 2020",
			"email": "info@commonspace.gr",
			"phone": "2103606333",
			"address": "Akakiou 1 - 3 & Ipeirou 60, 10439, Athens"
		},
		"Ekdoseis34562456": {
			"id": "Ekdoseis34562456",
			"name": "Εκδόσεις των Συναδέλφων",
			"img": "./assets/media/images/uploaded/synallois.jpg",
			"sector": "Food",
			"subscription_date": "Jan 1, 2020",
			"email": "info@synallois.org",
			"phone": "2103606333",
			"address": "Nileos 35, 11851, Athens"
		},
	};
	
	//Set Child Modals
	@ViewChild('qrcode', { static: false }) qrcode;
	@ViewChild('wallet', { static: false }) wallet;
	@ViewChild('microcredit_item', { static: false }) microcreditItem;

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
		private itemsService: ItemsService,
		private microcreditService: MicrocreditService,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	* On init
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
	* Assets Function On init
	*/

	//Get the Badge of the Customer
	fetchBadgeData() {
		this.loyaltyService.readBadge()
		.pipe(
			tap(
				data => {
					this.badge = data;
					//Set Data for Badge based On Level
					switch(this.badge.slug) {
						case 1:
							this.badge.image = this.badgesImages.supporter;
							this.badge.text_id = 5;
							break;
						case 2:
							this.badge.image = this.badgesImages.helper;
							this.badge.text_id = 7;
						  break;
						case 3:
							this.badge.image = this.badgesImages.one_of_us;
							this.badge.text_id = 9;
						  break;
					} 
					//Get static content of Badge
					this.staticContentService.readText(this.badge.text_id)
					.pipe(
						tap(
							data => {
								this.badge.text = data;
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
						this.balance = parseInt(data.points, 16);
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
		this.itemsService.readAllOffers()
			.pipe(
				tap(
					data => {
						this.offers = data;
						//console.log(this.offers)
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

	//Get the Mircoredit the Customer supports
	fetchSupportsData() {
		this.microcreditService.readAllBackerSupports()
			.pipe(
				tap(
					data => {
						this.supports = data;
						console.log(this.supports);
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
		this.modalService.open(this.qrcode).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
	}
	openWallet() {
		this.modalService.open(this.wallet).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');
		});
	}
	openSupport(singleId) {
		/*
		this.microcredit = this.list.find(x => x.id === singleId);
		console.log(this.microcredit);
		console.log(singleId);
		this.modalService.open(this.microcreditItem).result.then((result) => {
			console.log('closed');
		}, (reason) => {
			console.log('dismissed');

		});*/
	}

}