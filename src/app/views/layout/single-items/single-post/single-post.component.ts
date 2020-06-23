import { Input, Component, OnInit } from '@angular/core';

/**
 * Models & Interfaces
 */
import { PostEvent } from 'src/app/core/models/post_event.model';

@Component({
	selector: 'app-single-post',
	templateUrl: './single-post.component.html',
	styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {

	/**
	 * Imported Variables
	 */
	@Input() singlePost: PostEvent;

	constructor() { }

	/**
	 * On Init
	 */
	ngOnInit() {
	}

}
