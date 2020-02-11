import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-offer',
  templateUrl: './card-offer.component.html',
  styleUrls: ['./card-offer.component.scss']
})
export class CardOfferComponent implements OnInit {
	@Input() offer: any;
	
	constructor() { }

	ngOnInit() {
	}

}
