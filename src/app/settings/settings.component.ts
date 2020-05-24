import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StaticDataService } from '../core/services/static-data.service';

interface Menu {
	title?: string,
	link?: string,
	icon?: string
}

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	currentRouteUrl: string = '';
	public menu: Menu[];

	constructor(
		private router: Router,
		private cdr: ChangeDetectorRef,
		private staticDataService: StaticDataService
	) {
		this.menu = this.staticDataService.getSettingsSubMenu;
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
		let classes = 'menu-item';
		if (this.currentRouteUrl.indexOf(item) !== -1) {
			classes += ' menu-item-active';
		}
		return classes;
	}

}
