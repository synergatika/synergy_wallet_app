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
		const now = new Date();
		this.seconds = parseInt(now.getTime().toString());

		this.outOfPeriod = ((this.seconds < this.microcredit.startsAt) || (this.seconds > this.microcredit.expiresAt)) ? true : false;
	}

	pledgeModal(campaign: MicrocreditCampaign) {
		const dialogConfig = new MatDialogConfig();
		// The user can't close the dialog by clicking outside its body
		dialogConfig.disableClose = true;
		dialogConfig.id = "modal-component";
		dialogConfig.height = "auto";
		dialogConfig.width = "600px";
		dialogConfig.data = {
			campaign: campaign
		};
		const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
	}

}
