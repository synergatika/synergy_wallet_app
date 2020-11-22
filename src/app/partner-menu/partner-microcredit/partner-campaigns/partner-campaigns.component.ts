import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

/**
 * Models & Interfaces
 */
import { MicrocreditCampaign } from 'sng-core';

@Component({
	selector: 'app-partner-campaigns',
	templateUrl: './partner-campaigns.component.html',
	styleUrls: ['./partner-campaigns.component.scss']
})
export class PartnerCampaignsComponent implements OnInit, OnDestroy {
	/**
	 * Content Variables
	 */
	public campaigns: MicrocreditCampaign[];
	seconds: number = 0;

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	/**
     * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param translate: TranslateService
	 * @param authenticationService: AuthenticationService
	 * @param itemsService: ItemsService
	 */
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
		const now = new Date();
		this.seconds = parseInt(now.getTime().toString());

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

	/**
	 * Fetch Campaigns Data (for One Partner)
	 */
	fetchCampaignsData() {
		this.itemsService.readPrivateMicrocreditCampaignsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.campaigns = data.filter(item => {
							return (item.redeemEnds > this.seconds);
						});;
						console.log("Partner MIcrocredit Campaigns", this.campaigns)
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
