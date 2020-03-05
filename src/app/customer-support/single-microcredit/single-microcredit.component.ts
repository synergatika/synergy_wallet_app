import { Input, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SupportMicrocreditComponent } from '../support-microcredit/support-microcredit.component'

@Component({
	selector: 'app-single-microcredit',
	templateUrl: './single-microcredit.component.html',
	styleUrls: ['./single-microcredit.component.scss']
})
export class SingleMicrocreditComponent implements OnInit {

	//Set Variables Imported
	@Input() singleMicrocredit: any;

	constructor(
		public matDialog: MatDialog,
	) {
   
	}

	ngOnInit() {
		console.log(this.singleMicrocredit);
	}

	pledgeModal(merchant_id: string, campaign_id: string) {
		const dialogConfig = new MatDialogConfig();
		// The user can't close the dialog by clicking outside its body
		dialogConfig.disableClose = true;
		dialogConfig.id = "modal-component";
		dialogConfig.height = "auto";
		dialogConfig.width = "600px";
		dialogConfig.data = {
		  merchant_id: merchant_id,
		  campaign_id: campaign_id
		};
		const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
	  }

}
