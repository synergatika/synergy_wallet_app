import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-microcredit',
  templateUrl: './card-microcredit.component.html',
  styleUrls: ['./card-microcredit.component.scss']
})
export class CardMicrocreditComponent implements OnInit {
	@Input() microcredit: any;
	@Input() type: any;
	
	constructor() { }

	ngOnInit() {
	}

}