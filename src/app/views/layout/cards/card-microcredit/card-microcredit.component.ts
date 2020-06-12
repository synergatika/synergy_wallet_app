import { Component, OnInit, Input } from '@angular/core';
import { MicrocreditCampaign } from '../../../../core/models/microcredit_campaign.model';

@Component({
	selector: 'app-card-microcredit',
	templateUrl: './card-microcredit.component.html',
	styleUrls: ['./card-microcredit.component.scss']
})
export class CardMicrocreditComponent implements OnInit {
	@Input() microcredit: MicrocreditCampaign;
	@Input() type: any;

	seconds: number = 0;

	constructor() { }

	ngOnInit() {
		const now = new Date();
		this.seconds = parseInt(now.getTime().toString());
	}

}
