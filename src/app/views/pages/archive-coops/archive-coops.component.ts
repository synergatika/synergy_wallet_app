import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { PartnersService } from '../../../core/services/partners.service';
import { Partner } from '../../../core/models/partner.model';

@Component({
	selector: 'app-archive-coops',
	templateUrl: './archive-coops.component.html',
	styleUrls: ['./archive-coops.component.scss']
})
export class ArchiveCoopsComponent implements OnInit {

	public partners: Partner[];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	constructor(private cdRef: ChangeDetectorRef, private partnersService: PartnersService) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchPartnersData();
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	fetchPartnersData() {
		this.partnersService.readPartners('0-0-0')
			.pipe(
				tap(
					data => {
						this.partners = data;
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
		console.log('scrolled!!');
		this.partners = this.partners.concat(this.partners);
		this.cdRef.markForCheck();
	}
}
