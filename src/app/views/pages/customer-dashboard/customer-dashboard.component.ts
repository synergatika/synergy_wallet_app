import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { first, tap, finalize, takeUntil } from 'rxjs/operators';
import { Subject, Subscriber } from 'rxjs';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { ItemsService } from '../../../core/services/items.service';
<<<<<<< HEAD
import { MicrocreditService } from '../../../core/services/microcredit.service';
=======
>>>>>>> origin/kel
import { QrCodeComponent } from '../../../views/pages/qr-code/qr-code.component';

import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

<<<<<<< HEAD
import { MicrocreditSupport } from '../../../core/models/microcredit-support.model';

@Component({
	selector: 'app-customer-dashboard',
	templateUrl: './customer-dashboard.component.html',
	styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

	balance: number = 0;
	offers: any;
	supports: MicrocreditSupport[];

	loading: boolean = false;
	private unsubscribe: Subject<any>;
	list = [
=======
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {

  balance: number = 0;
  offers: any;
  loading: boolean = false;
  private unsubscribe: Subject<any>;
  list = [
>>>>>>> origin/kel
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
<<<<<<< HEAD

	coops = {
		"Synallois14234562456": {
			"id": "Synallois14234562456",
=======
	
	coops = {
		"Synallois14234562456" : {
			"id":"Synallois14234562456",
>>>>>>> origin/kel
			"name": "Συν Άλλοις",
			"img": "./assets/media/images/uploaded/commonspace.webp",
			"sector": "Recreation and Culture",
			"subscription_date": "Jan 5, 2020",
			"email": "info@commonspace.gr",
			"phone": "2103606333",
			"address": "Akakiou 1 - 3 & Ipeirou 60, 10439, Athens"
		},
<<<<<<< HEAD
		"Ekdoseis34562456": {
			"id": "Ekdoseis34562456",
=======
		"Ekdoseis34562456" : {
			"id":"Ekdoseis34562456",
>>>>>>> origin/kel
			"name": "Εκδόσεις των Συναδέλφων",
			"img": "./assets/media/images/uploaded/synallois.jpg",
			"sector": "Food",
			"subscription_date": "Jan 1, 2020",
			"email": "info@synallois.org",
			"phone": "2103606333",
			"address": "Nileos 35, 11851, Athens"
		},
	};
	microcredit: any;
<<<<<<< HEAD

	@ViewChild('microcredit_item', { static: false }) microcreditItem;
	@ViewChild('qrcode', { static: false }) qrcode;
	@ViewChild('wallet', { static: false }) wallet;

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
		private loyaltyService: LoyaltyService,
		private itemsService: ItemsService,
		private microcreditService: MicrocreditService,
		private modalService: NgbModal
	) {
		this.unsubscribe = new Subject();
	}

	/**
	* On init
	*/
	ngOnInit() {
		this.fetchBalanceData();
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

	fetchBalanceData() {
		this.loyaltyService.readBalance()
			.pipe(
				tap(
					data => {
						this.balance = parseInt(data.points, 16);
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
						console.log(this.offers)

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


	fetchSupportsData() {
		this.microcreditService.readAllSuports()
			.pipe(
				tap(
					data => {
						this.supports = data;
						console.log(this.supports);
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
	openCoop(singleId) {
=======
	
	@ViewChild('microcredit_item', {static: false}) microcreditItem;
	@ViewChild('qrcode', {static: false}) qrcode;
	@ViewChild('wallet', {static: false}) wallet;

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
    private loyaltyService: LoyaltyService,
	private itemsService: ItemsService,
	private modalService: NgbModal
  ) {
    this.unsubscribe = new Subject();
  }

  /**
  * On init
  */
  ngOnInit() {
    this.fetchBalanceData();
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

  fetchBalanceData() {
    this.loyaltyService.readBalance()
      .pipe(
        tap(
          data => {
            this.balance = parseInt(data.points, 16);
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
            console.log(this.offers)

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
  
  openCoop(singleId) {
>>>>>>> origin/kel
		this.microcredit = this.list.find(x => x.id === singleId);
		console.log(this.microcredit);
		console.log(singleId);
		this.modalService.open(this.microcreditItem).result.then((result) => {
			console.log('closed');

<<<<<<< HEAD
		}, (reason) => {
			console.log('dismissed');

		});
	}

	openQrcode() {
=======
			}, (reason) => {
				console.log('dismissed');

        });
  }
  
  openQrcode() {
>>>>>>> origin/kel
		/*this.modalService.open(this.qrcode).result.then((result) => {
			console.log('closed');

			}, (reason) => {
				console.log('dismissed');

        });*/
		const modalRef = this.modalService.open(QrCodeComponent);
<<<<<<< HEAD
	}

	openWallet() {
		this.modalService.open(this.wallet).result.then((result) => {
			console.log('closed');

		}, (reason) => {
			console.log('dismissed');

		});
	}

=======
  }
  
  openWallet() {
		this.modalService.open(this.wallet).result.then((result) => {
			console.log('closed');

			}, (reason) => {
				console.log('dismissed');

        });
  }
  
>>>>>>> origin/kel
}