import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { PartnersService } from '../../../core/services/partners.service';

/**
 * Models & Interfaces
 */
import { Partner } from 'sng-core';

@Component({
	selector: 'app-archive-partners',
	templateUrl: './archive-partners.component.html',
	styleUrls: ['./archive-partners.component.scss']
})
export class ArchivePartnersComponent implements OnInit {

	/**
	 * Content Variables
	 */
	public partners: Partner[] = [];

	counter = 0;

	loading = false;
	private unsubscribe: Subject<any>;

	/**
	 * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param translate: TranslateService
	 * @param partnersService: PartnersService
	 */
	constructor(
		private cdRef: ChangeDetectorRef,
		public translate: TranslateService,
		private partnersService: PartnersService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchPartnersData(this.counter);
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
	 * Fetch Partners List
	 */
	fetchPartnersData(counter: number) {
		this.partnersService.readPartners(`6-${counter.toString()}-0`)
			.pipe(
				tap(
					data => {
						this.partners = this.partners.concat(data);
						//	this.partners = data;
						console.log(this.partners)
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

	/**
	 * On Scroll
	 */
	onScroll() {
		this.counter = this.counter + 1;
		this.fetchPartnersData(this.counter);
		console.log('scrolled!!');
		//this.partners = this.partners.concat(this.partners);
		this.cdRef.markForCheck();
	}
}
