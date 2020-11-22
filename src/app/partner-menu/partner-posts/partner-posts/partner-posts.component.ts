import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

/**
 * Services
 */
import { AuthenticationService } from '../../../core/services/authentication.service';
import { ItemsService } from '../../../core/services/items.service';

import { Post } from 'sng-core';

@Component({
	selector: 'app-partner-posts',
	templateUrl: './partner-posts.component.html',
	styleUrls: ['./partner-posts.component.scss']
})
export class PartnerPostsComponent implements OnInit, OnDestroy {

	/**
	 * Content Variables
	 */
	public posts: Post[];

	loading: boolean = false;
	private unsubscribe: Subject<any>;

	/**
     * Component Constructor
	 *
	 * @param cdRef: ChangeDetectorRef
	 * @param authenticationService: AuthenticationService
	 * @param itemsService: ItemsService
	 */
	constructor(
		private cdRef: ChangeDetectorRef,
		private authenticationService: AuthenticationService,
		private itemsService: ItemsService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.fetchPostsData();
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Fetch Post Data (for One Partner)
	 */
	fetchPostsData() {
		this.itemsService.readPrivatePostsByStore(this.authenticationService.currentUserValue.user["_id"], '0-0-0')
			.pipe(
				tap(
					data => {
						this.posts = data;
						console.log("Partner Posts", this.posts);
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
}
