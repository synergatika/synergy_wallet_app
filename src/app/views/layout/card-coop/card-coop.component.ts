import { Component, OnInit, Input } from '@angular/core';
import { Partner } from '../../../core/models/partner.model';

@Component({
	selector: 'app-card-coop',
	templateUrl: './card-coop.component.html',
	styleUrls: ['./card-coop.component.scss']
})
export class CardCoopComponent implements OnInit {
	@Input() coop: Partner;

	constructor() { }

	ngOnInit() {

	}


}
