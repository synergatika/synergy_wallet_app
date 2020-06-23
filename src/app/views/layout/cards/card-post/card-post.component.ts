import { Component, OnInit, Input } from '@angular/core';

/**
 * Models & Interfaces
 */
import { PostEvent } from '../../../../core/models/post_event.model';

@Component({
	selector: 'app-card-post',
	templateUrl: './card-post.component.html',
	styleUrls: ['./card-post.component.scss']
})
export class CardPostComponent implements OnInit {
	/**
	 * Imported Variables
	 */
	@Input() post: PostEvent;
	@Input() type: string;

	constructor() { }

	ngOnInit() {
	}

}
