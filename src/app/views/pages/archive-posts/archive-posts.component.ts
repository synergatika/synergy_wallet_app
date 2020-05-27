import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../../../core/services/items.service';
import { PostEvent } from '../../../core/models/post_event.model';

@Component({
	selector: 'app-archive-posts',
	templateUrl: './archive-posts.component.html',
	styleUrls: ['./archive-posts.component.scss']
})
export class ArchivePostsComponent implements OnInit {

	public posts: PostEvent[] = [];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	counter: number = 0;

	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On destroy
	 */
	ngOnInit() {
		this.fetchPostsEventsData(this.counter);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	fetchPostsEventsData(counter: number) {
		this.itemsService.readAllPrivatePostsEvents(`6-${counter.toString()}-0`)
			.pipe(
				tap(
					data => {
						this.posts = this.posts.concat(data);
						console.log("all posts");
						console.log(this.posts)
					},
					error => {
					}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}

	onScroll() {
		this.counter = this.counter + 1;
		this.fetchPostsEventsData(this.counter);
		console.log('scrolled!!');
		this.cdRef.markForCheck();
	}
}
