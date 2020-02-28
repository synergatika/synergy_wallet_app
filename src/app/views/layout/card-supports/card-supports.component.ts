import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-supports',
  templateUrl: './card-supports.component.html',
  styleUrls: ['./card-supports.component.scss']
})
export class CardSupportsComponent implements OnInit {
	@Input() supportItem: any;

	constructor() { }

	ngOnInit() {
	}

}
