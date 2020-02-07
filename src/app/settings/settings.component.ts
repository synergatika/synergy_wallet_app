import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	currentRouteUrl: string = '';
	menu = [
		{
			title: 'Profile',
			link: 'profile',
			icon: '',
		},

		{
			title: 'Account settings',
			link: 'account-settings',
			icon: '',
		},
		/*{
			title: 'Email settings',
			link: 'email-settings',
			icon: '',
		},
		{
			title: 'Change password',
			link: 'change-password',
			icon: '',
		},
		{
			title: 'Basket',
			link: 'history/basket',
			icon: '',
		},*/
		{
			title: 'Transactions',
			link: 'history/transactions',
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
