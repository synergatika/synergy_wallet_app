import { Component, OnInit, Input } from '@angular/core';
import { Merchant } from '../../../core/models/merchant.model';

@Component({
  selector: 'app-card-coop',
  templateUrl: './card-coop.component.html',
  styleUrls: ['./card-coop.component.scss']
})
export class CardCoopComponent implements OnInit {
	@Input() coop: Merchant;
	
	constructor() { }

	ngOnInit() {

	}


}
