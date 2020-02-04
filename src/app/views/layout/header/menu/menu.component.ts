import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
	menu = [
		{
			title: 'Home',
			link: '/',
			icon: 'home-roof',
		},
		{
			title: 'Dashboard',
			link: 'dashboard',
			icon: 'wallet-outline',
		},
		{
			title: 'Profile',
			link: 'settings',
			icon: 'settings',
		},
		{
			title: 'QR code',
			link: 'qr-code',
			icon: 'qrcode',
		},
		{
			title: 'Explore',
			link: 'explore',
			icon: 'compass-outline',
		},
	];
	constructor(private menuService : MenuService) { }

	ngOnInit() {
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
