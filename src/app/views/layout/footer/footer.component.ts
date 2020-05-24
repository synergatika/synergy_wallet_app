import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { StaticDataService } from '../../../core/services/static-data.service';

interface Menu {
	title?: string,
	link?: string,
	icon?: string
}

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	currentRouteUrl: string = '';
	public menu: Menu[];

	constructor(
		private authenticationService: AuthenticationService,
		private router: Router,
		private cdr: ChangeDetectorRef,
		private translate: TranslateService,
		private staticDataService: StaticDataService
	) {
		const currentUser = this.authenticationService.currentUserValue;
		this.menu = (currentUser.user["access"] === 'member') ? this.staticDataService.getMemberMenu : [];
	}

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
