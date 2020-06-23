import { Component, OnInit, Input } from '@angular/core';

/**
 * Models & Interfaces
 */
import { Partner } from '../../../../core/models/partner.model';

@Component({
	selector: 'app-card-partner',
	templateUrl: './card-partner.component.html',
	styleUrls: ['./card-partner.component.scss']
})
export class CardPartnerComponent implements OnInit {
	/**
	 * Imported Variables
	 */
	@Input() partner: Partner;

	constructor() { }

	ngOnInit() {
	}
}
