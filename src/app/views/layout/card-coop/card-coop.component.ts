import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-coop',
  templateUrl: './card-coop.component.html',
  styleUrls: ['./card-coop.component.scss']
})
export class CardCoopComponent implements OnInit {
	@Input() coop: any;
	
	constructor() { }

	ngOnInit() {

	}


}
