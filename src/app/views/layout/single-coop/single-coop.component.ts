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
	singleOffers : any;

	//Set Child Modals
	@ViewChild('microcreditModal', {static: false}) microcreditModal;
	@ViewChild('postModal', {static: false}) postModal;

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
		private elRef:ElementRef
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchSingleOffersData(this.singleCoop._id);
		//this.singleMicrocredit = [this.list.find(x => x.coop_id === coop._id)];
		//this.singleMicrocredit = this.list;
		//console.log(this.singleMicrocredit);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	* Assets Function On init
	*/

	fetchSingleOffersData(merchant_id) {
		this.singleOffers = null;
		this.itemsService.readOffersByStore(merchant_id)
		  .pipe(
			tap(
			  data => {
				console.log("single offers");
				console.log(data);
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

}
