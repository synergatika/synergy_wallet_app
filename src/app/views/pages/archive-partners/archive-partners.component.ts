import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { PartnersService } from '../../../core/services/partners.service';
import { Partner } from '../../../core/models/partner.model';

@Component({
	selector: 'app-archive-partners',
	templateUrl: './archive-partners.component.html',
	styleUrls: ['./archive-partners.component.scss']
})
export class ArchivePartnersComponent implements OnInit {

	public partners: Partner[] = [];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	counter: number = 0;

	constructor(private cdRef: ChangeDetectorRef, private partnersService: PartnersService) {
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

	onScroll() {
		this.counter = this.counter + 1;
		this.fetchPartnersData(this.counter);
		console.log('scrolled!!');
		//this.partners = this.partners.concat(this.partners);
		this.cdRef.markForCheck();
	}
}
