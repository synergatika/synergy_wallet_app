import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.scss']
})
export class CardPostComponent implements OnInit {
	@Input() post: any;
	@Input() type: any;
	
	constructor() { }

	ngOnInit() {
	}

}
