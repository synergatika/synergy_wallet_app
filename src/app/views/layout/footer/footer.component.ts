import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	currentRouteUrl: string = '';
	user: any;
	menuConsumer = [
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
	menuMerchant = [
		{
			title: 'Πορτοφόλι',
			link: 'dashboard',
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
		{
			title: 'Create',
			link: 'create',
			icon: 'handshake',
		},
		{
			title: 'Microcredit',
			link: 'microcredit',
			icon: 'handshake',
		},
		{
			title: 'Scanner',
			link: 'scanner',
			icon: 'handshake',
		},
	];
	menu = [];
	
	constructor(private authenticationService: AuthenticationService, private router: Router, private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
		if(this.user.access == 'merchant') {
			this.menu = this.menuMerchant;
		}
		else {
			this.menu = this.menuConsumer;
		}
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
