import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ItemsService } from '../../../core/services/items.service';
import { tap, takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
<<<<<<< HEAD
	selector: 'app-archive-posts',
	templateUrl: './archive-posts.component.html',
	styleUrls: ['./archive-posts.component.scss']
=======
  selector: 'app-archive-posts',
  templateUrl: './archive-posts.component.html',
  styleUrls: ['./archive-posts.component.scss']
>>>>>>> origin/kel
})
export class ArchivePostsComponent implements OnInit {
	posts: any;
	loading: boolean = false;
	private unsubscribe: Subject<any>;
<<<<<<< HEAD

	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService, ) {
=======
	
	constructor(private cdRef: ChangeDetectorRef, private itemsService: ItemsService,) {
>>>>>>> origin/kel
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchPostsData();
	}
<<<<<<< HEAD

	fetchPostsData() {
		this.itemsService.readAllPrivatePosts()
			.pipe(
				tap(
					data => {
						this.posts = data;
						console.log("posts");
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

=======
	
	fetchPostsData() {
		this.itemsService.readAllPrivatePosts()
		  .pipe(
			tap(
			  data => {
				this.posts = data;
				console.log("posts");
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
	
>>>>>>> origin/kel
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}
<<<<<<< HEAD

=======
	
>>>>>>> origin/kel
	onScroll() {
		console.log('scrolled!!');
		this.posts = this.posts.concat(this.posts);
		this.cdRef.markForCheck();
	}

}
