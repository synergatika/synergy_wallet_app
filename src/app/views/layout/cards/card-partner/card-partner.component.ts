import { Component, OnInit, Input } from '@angular/core';
import { Partner } from '../../../../core/models/partner.model';

@Component({
	selector: 'app-card-partner',
	templateUrl: './card-partner.component.html',
	styleUrls: ['./card-partner.component.scss']
})
export class CardPartnerComponent implements OnInit {
	@Input() partner: Partner;

	constructor() { }

	ngOnInit() {
	}
}
