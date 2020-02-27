import { Input, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
	selector: 'app-single-microcredit',
	templateUrl: './single-microcredit.component.html',
	styleUrls: ['./single-microcredit.component.scss']
})
export class SingleMicrocreditComponent implements OnInit {

	//Set Variables Imported
	@Input() singleMicrocredit: any;

	constructor(

	) {
   
	}

	ngOnInit() {
	}

}
