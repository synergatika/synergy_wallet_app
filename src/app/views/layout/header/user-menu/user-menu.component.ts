import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
// RxJS
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../core/services/authentication.service';
// Models
import { AuthUser } from '../../../../core/models/auth.model';
import { StaticDataService } from '../../../../core/services/static-data.service';

interface Menu {
	title: string,
	link: string,
	icon: string
}

@Component({
	selector: 'app-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

	public menu: Menu[];

	icon: string = './assets/media/images/menu.svg';
	user: any;
	userAvatar: string;

	constructor(
		private menuService: MenuService,
		private authenticationService: AuthenticationService,
		private cDRef: ChangeDetectorRef,
		private staticDataService: StaticDataService
	) {
		this.menu = this.staticDataService.getUserSubMenu;
	}

	ngOnInit(): void {
		this.user = this.authenticationService.currentUserValue.user;
		//console.log(this.user);
		this.userAvatar = this.user.imageURL || '../../../../assets/media/users/default.jpg';
		this.cDRef.markForCheck();
	}

	openNav() {
		this.menuService.openNav();
	}

	logout() {
		console.log('logout');
		this.authenticationService.logout();
	}
}
