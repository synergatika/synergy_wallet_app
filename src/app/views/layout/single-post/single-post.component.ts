import { Input, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
	selector: 'app-single-post',
	templateUrl: './single-post.component.html',
	styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

	//Set Variables Imported
	@Input() singlePost: any;

	constructor(

	) {
   
	}

	ngOnInit() {
	}

}
