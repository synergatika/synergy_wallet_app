import { Component, OnInit, Input } from '@angular/core';
import { PostEvent } from '../../../core/models/post_event.model';

@Component({
  selector: 'app-card-post',
  templateUrl: './card-post.component.html',
  styleUrls: ['./card-post.component.scss']
})
export class CardPostComponent implements OnInit {
	@Input() post: PostEvent;
	@Input() type: string;
	
	constructor() { }

	ngOnInit() {
	}

}
