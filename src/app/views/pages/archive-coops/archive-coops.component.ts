import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PartnersService } from '../../../core/services/partners.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Partner } from '../../../core/models/partner.model';

@Component({
	selector: 'app-archive-coops',
	templateUrl: './archive-coops.component.html',
	styleUrls: ['./archive-coops.component.scss']
})
export class ArchiveCoopsComponent implements OnInit {
	partners: Partner[];
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	constructor(private cdRef: ChangeDetectorRef, private partnersService: PartnersService, ) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchPartnersData();
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

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	onScroll() {
		console.log('scrolled!!');
		this.partners = this.partners.concat(this.partners);
		this.cdRef.markForCheck();
	}

}
