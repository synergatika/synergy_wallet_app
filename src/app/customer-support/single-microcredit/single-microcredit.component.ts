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
	}

	pledgeModal(merchant_id: string, campaign_id: string) {
		console.log("test");
		const dialogConfig = new MatDialogConfig();
		// The user can't close the dialog by clicking outside its body
		dialogConfig.disableClose = true;
		dialogConfig.id = "modal-component";
		dialogConfig.height = "350px";
		dialogConfig.width = "600px";
		dialogConfig.data = {
		  merchant_id: merchant_id,
		  campaign_id: campaign_id
		};
		const modalDialog = this.matDialog.open(SupportMicrocreditComponent, dialogConfig);
	  }

}
