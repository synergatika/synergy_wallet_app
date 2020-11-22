import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/helpers/menu.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
	user: any;

	constructor(
		private menuService: MenuService,
		private authenticationService: AuthenticationService
	) { }

	/**
	 * On Init
	 */
	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
	}

	openNav() {
		this.menuService.openNav();
		/*document.getElementById("mySidenav").style.width = "250px";
		document.getElementById("main").style.marginLeft = "250px";
		//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
		document.body.classList.add("menu-overlay");*/
	}

	/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
	closeNav() {
		this.menuService.closeNav();
		/*
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("main").style.marginLeft = "0";
		//document.body.classList.replace("menu-overlay", "");
		document.body.classList.remove("menu-overlay");
		*/
	}

}
