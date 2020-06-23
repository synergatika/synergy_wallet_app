import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { AuthenticationService } from '../../../../core/services/authentication.service';

/**
 * Models & Interfaces
 */
import { MicrocreditCampaign } from '../../../../core/models/microcredit_campaign.model';

@Component({
	selector: 'app-card-microcredit',
	templateUrl: './card-microcredit.component.html',
	styleUrls: ['./card-microcredit.component.scss']
})
export class CardMicrocreditComponent implements OnInit {
	/**
	 * Imported Variables
	 */
	@Input() microcredit: MicrocreditCampaign;
	@Input() type: any;

	seconds: number = 0;
	public flag: string = '';
	public canSupport: boolean = false;
	public canRedeem: boolean = false;

	constructor(
		private translate: TranslateService,
		private authenticationService: AuthenticationService
	) { }

	ngOnInit() {
		const now = new Date();
		this.seconds = parseInt(now.getTime().toString());

		//	console.log('Campaign')
		//	console.log(this.microcredit);
		const currentUser = this.authenticationService.currentUserValue;
		const access = currentUser.user["access"];

		if (this.microcredit['status'] === 'draft') {
			this.canSupport = false;
			this.flag = this.translate.instant('CAMPAIGN.STATUS.DRAFT');
		} else if (this.microcredit.startsAt > this.seconds) {
			this.canSupport = false;
			this.canRedeem = false;
			this.flag = this.translate.instant('CAMPAIGN.STATUS.EXPECTED');
		} else if ((this.microcredit.expiresAt > this.seconds) && (this.seconds > this.microcredit.startsAt)) {
			this.canSupport = true;
			this.flag = this.translate.instant('GENERAL.TO');
		} else if (this.seconds > this.microcredit.expiresAt) {
			this.canSupport = false;
			this.flag = this.translate.instant('CAMPAIGN.STATUS.REDEEM_TO');
			this.canRedeem = (access == 'partner') ? true : false;
		}
	}
}
