import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { ItemsService } from '../../../core/services/items.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-merchant-posts',
  templateUrl: './merchant-posts.component.html',
  styleUrls: ['./merchant-posts.component.scss']
})
export class MerchantPostsComponent implements OnInit {
	loading: boolean = false;
	private unsubscribe: Subject<any>;
	posts: any;
	
	constructor(private itemsService: ItemsService, private cdRef: ChangeDetectorRef, private authenticationService: AuthenticationService,) { 
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchPostsData();
	}
	
	fetchPostsData() {
		this.itemsService.readPrivatePostsByStore(this.authenticationService.currentUserValue.user["_id"])
		  .pipe(
			tap(
			  data => {
				this.posts = data;
				console.log(this.posts)
				//this.scannerService.changeOffers(this.posts);
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

}
