import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ItemsService } from '../../core/services/items.service';

import { MicrocreditCampaign } from '../../core/models/microcredit_campaign.model'

@Component({
	selector: 'app-partner-campaigns',
	templateUrl: './partner-campaigns.component.html',
	styleUrls: ['./partner-campaigns.component.scss']
})
export class PartnerCampaignsComponent implements OnInit, OnDestroy {
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	public campaigns: MicrocreditCampaign[];

	constructor(
		private cdRef: ChangeDetectorRef,
		private translate: TranslateService,
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchCampaignsData();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	fetchCampaignsData() {
		this.itemsService.readPrivateMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.campaigns = data;
						console.log(this.campaigns);
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

}
