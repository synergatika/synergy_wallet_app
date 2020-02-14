import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	currentRouteUrl: string = '';
	menu = [
		{
			title: 'Πορτοφόλι',
			link: 'dashboard',
			//icon: './assets/media/images/wallet.png',
			icon: 'wallet-outline',
		},
		{
			title: 'Ανακάλυψε',
			link: 'explore',
			icon: 'compass-outline',
		},
		{
			title: 'Υποστήριξε',
			link: 'support',
			icon: 'handshake',
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
		let classes = 'footer-menu-item';
		if (this.currentRouteUrl.indexOf(item) !== -1) {
			classes += ' footer-menu-item-active';
		}
		return classes;
	}
}
