import { Input, Component, OnInit } from '@angular/core';
import { PostEvent } from 'src/app/core/models/post_event.model';

@Component({
	selector: 'app-single-post',
	templateUrl: './single-post.component.html',
	styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

	//Set Variables Imported
	@Input() singlePost: PostEvent;

	constructor(

	) {

	}

	ngOnInit() {
	}

}
