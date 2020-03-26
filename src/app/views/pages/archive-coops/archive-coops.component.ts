import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MerchantsService } from '../../../core/services/merchants.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Merchant } from '../../../core/models/merchant.model';

@Component({
	selector: 'app-archive-coops',
	templateUrl: './archive-coops.component.html',
	styleUrls: ['./archive-coops.component.scss']
})
export class ArchiveCoopsComponent implements OnInit {
	merchants: Merchant[];
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	constructor(private cdRef: ChangeDetectorRef, private merchantsService: MerchantsService, ) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchMerchantsData();
	}

	fetchMerchantsData() {
		this.merchantsService.readMerchants('0-0-0')
			.pipe(
				tap(
					data => {
						this.merchants = data;
						console.log(this.merchants)
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

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	onScroll() {
		console.log('scrolled!!');
		this.merchants = this.merchants.concat(this.merchants);
		this.cdRef.markForCheck();
	}

}
