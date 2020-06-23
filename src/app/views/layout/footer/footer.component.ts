import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/**
 * Services
 */
import { StaticDataService } from '../../../core/services/static-data.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

/**
 * Models & Interfaces
 */
import { Menu } from '../../../core/interfaces/menu.interface';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	currentRouteUrl: string = '';
	public menu: Menu[];

	constructor(
		private cdr: ChangeDetectorRef,
		private router: Router,
		private translate: TranslateService,
		private staticDataService: StaticDataService,
		private authenticationService: AuthenticationService
	) {
		const currentUser = this.authenticationService.currentUserValue;
		this.menu = (currentUser.user["access"] === 'member') ? this.staticDataService.getMemberMenu : [];
	}

	/**
	 * On Init
	 */
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
