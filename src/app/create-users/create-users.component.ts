import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-create-items',
	templateUrl: './create-users.component.html',
	styleUrls: ['./create-users.component.scss']
})
export class CreateUsersComponent implements OnInit {
	// currentRouteUrl: string = '';
	// menu = [
	// 	{
	// 		title: 'Create Customer',
	// 		link: 'users/customer',
	// 		icon: '',
	// 	},
	// 	{
	// 		title: 'Create Merchant',
	// 		link: 'users/merchant',
	// 		icon: '',
	// 	},
	// ];
	constructor(private router: Router, private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		// this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
		// this.router.events
		// 	.pipe(filter(event => event instanceof NavigationEnd))
		// 	.subscribe(event => {
		// 		this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
		// 		this.cdr.markForCheck();
		// 	});
	}
	// getItemCssClasses(item) {
	// 	let classes = 'menu-item';
	// 	if (this.currentRouteUrl.indexOf(item) !== -1) {
	// 		classes += ' menu-item-active';
	// 	}
	// 	return classes;
	// }

}
