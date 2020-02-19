import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.scss']
})
export class CreateItemsComponent implements OnInit {
	currentRouteUrl: string = '';
	menu = [
		{
			title: 'Create Offer',
			link: 'offer',
			icon: '',
		},
		{
			title: 'Create Post',
			link: 'post',
			icon: '',
		},
		{
			title: 'Create Event',
			link: 'event',
			icon: '',
		},
		{
			title: 'Create Microcredit Campaign',
			link: 'microcredit',
			icon: '',
		},
	];
	constructor(private router: Router,private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(event => {
				this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
				this.cdr.markForCheck();
			});
	}
	getItemCssClasses(item) {
		let classes = 'menu-item';
		if (this.currentRouteUrl.indexOf(item) !== -1) {
			classes += ' menu-item-active';
		}
		return classes;
	}	

}
