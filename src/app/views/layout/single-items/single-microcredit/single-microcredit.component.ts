import { Input, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SupportMicrocreditComponent } from '../../../../member-support/support-microcredit/support-microcredit.component';
import { MicrocreditCampaign } from 'src/app/core/models/microcredit_campaign.model';

@Component({
	selector: 'app-single-microcredit',
	templateUrl: './single-microcredit.component.html',
	styleUrls: ['./single-microcredit.component.scss']
})
export class SingleMicrocreditComponent implements OnInit {

	//Set Variables Imported
	@Input() microcredit: MicrocreditCampaign;

	seconds: number = 0;

	public outOfPeriod: boolean = false;
	constructor(
		public matDialog: MatDialog,
	) {

	}

	ngOnInit() {
		console.log(this.microcredit);
		const now = new Date();
		this.seconds = parseInt(now.getTime().toString());

		if ((this.seconds < this.microcredit.startsAt) || (this.seconds > this.microcredit.expiresAt)) this.outOfPeriod = true;
		console.log("Expired: ", this.outOfPeriod);
	}

	pledgeModal(partner_id: string, campaign_id: string) {
		const dialogConfig = new MatDialogConfig();
		// The user can't close the dialog by clicking outside its body
		dialogConfig.disableClose = true;
		dialogConfig.id = "modal-component";
		dialogConfig.height = "auto";
		dialogConfig.width = "600px";
		dialogConfig.data = {
			partner_id: partner_id,
			campaign_id: campaign_id
		};
		const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
	}

}
