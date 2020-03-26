import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PostEvent } from '../../../core/models/post_event.model';

@Component({
	selector: 'app-archive-posts',
	templateUrl: './archive-posts.component.html',
	styleUrls: ['./archive-posts.component.scss']
})
export class ArchivePostsComponent implements OnInit {
	public posts: PostEvent[];
	loading: boolean = false;
	private unsubscribe: Subject<any>;

	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService, ) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchPostsEventsData();
	}

	fetchPostsEventsData() {
		this.itemsService.readAllPrivatePostsEvents('0-0-0')
			.pipe(
				tap(
					data => {
						this.posts = data;
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

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	onScroll() {
		console.log('scrolled!!');
		this.posts = this.posts.concat(this.posts);
		this.cdRef.markForCheck();
	}

}
