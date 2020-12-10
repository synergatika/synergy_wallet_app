import { Injectable } from '@angular/core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

import { IMenuService, Menu } from 'sng-core';

@Injectable({
	providedIn: 'root'
})
export class MenuService extends IMenuService {

	memberMenu: Menu[] = [
		{
			title: 'MENU.DISCOVER',
			link: 'explore',
			icon: 'compass-outline',
			enable: true
		},
		{
			title: 'MENU.OFFERS',
			link: 'offers',
			icon: 'muffin',
			enable: environment.access[1]
		},
		{
			title: 'MENU.SUPPORT',
			link: 'support',
			icon: 'handshake',
			enable: environment.access[2]
		},
		{
			title: 'MENU.WALLET',
			link: 'wallet',
			icon: 'wallet-outline',
			enable: true
		},
	];

	partnerMenu: Menu[] = [
		{
			title: 'MENU.HOME',
			link: 'scanner',
			icon: 'home-roof',
			enable: true
		},
		{
			title: 'MENU.OFFERS',
			link: 'm-offers',
			icon: 'muffin',
			enable: environment.access[1]
		},
		{
			title: 'MENU.CAMPAIGNS',
			link: 'm-campaigns',
			icon: 'set-none',
			enable: environment.access[2]
		},
		{
			title: 'MENU.POSTS',
			link: 'm-posts',
			icon: 'file-document',
			enable: environment.access[0]
		},
		{
			title: 'MENU.EVENTS',
			link: 'm-events',
			icon: 'calendar',
			enable: environment.access[0]
		}
	];

	adminMenu: Menu[] = [
		{
			title: 'MENU.PARTNERS',
			link: 'a-partners',
			icon: 'handshake',
			enable: true
		},
		{
			title: 'MENU.MEMBERS',
			link: 'a-members',
			icon: 'account',
			enable: true
		},
		{
			title: 'MENU.CONTENT',
			link: 'a-content',
			icon: 'content-paste',
			enable: true
		}
	];

	userMenu: Menu[] = [
		{
			title: 'MENU.SETTINGS',
			link: 'settings',
			icon: '',
			enable: true
		},
		{
			title: 'MENU.HISTORY',
			link: 'history',
			icon: '',
			enable: (environment.access[1] || environment.access[2])
		}
	];

	subMenuSettings: Menu[] = [
		{
			title: 'SETTINGS.SUBMENU.PERSONAL_INFORMATION',
			link: 'personal-information',
			icon: '',
			enable: true
		},
		{
			title: 'SETTINGS.SUBMENU.PAYMENTS',
			link: 'payments',
			icon: '',
			enable: environment.subAccess[2] && (JSON.parse(localStorage.getItem('currentUser'))['user'].access == 'partner')
		},
		{
			title: 'SETTINGS.SUBMENU.CHANGE_PASSWORD',
			link: 'change-password',
			icon: '',
			enable: true
		},
		{
			title: 'SETTINGS.SUBMENU.ACCOUNT_SETTINGS',
			link: 'account-settings',
			icon: '',
			enable: true
		},
		{
			title: 'SETTINGS.SUBMENU.INVITATION',
			link: 'invitation',
			icon: '',
			enable: true
		}
	];

	subMenuHistory: Menu[] = [
		{
			title: 'HISTORY.SUBMENU.LOYALTY',
			link: 'loyalty',
			icon: '',
			enable: environment.access[1]
		},
		{
			title: 'HISTORY.SUBMENU.MICROCREDIT',
			link: 'microcredit',
			icon: '',
			enable: environment.access[2]
		}
	];

	public get getMemberMenu(): Menu[] {
		return this.memberMenu.filter((el) => {
			return el.enable === true
		});
	};

	public get getPartnerMenu(): Menu[] {
		return this.partnerMenu.filter((el) => {
			return el.enable === true
		});
	};

	public get getAdminMenu(): Menu[] {
		return this.adminMenu.filter((el) => {
			return el.enable === true
		});
	};

	public get getUserMenu(): Menu[] {
		return this.userMenu.filter((el) => {
			return el.enable === true
		});
	};

	public get getSettingsSubMenu(): Menu[] {
		return this.subMenuSettings.filter((el) => {
			return el.enable === true
		});
	};

	public get getHistorySubMenu(): Menu[] {
		return this.subMenuHistory.filter((el) => {
			return el.enable === true
		});
	};

	openNav() {
		//document.getElementById("mySidenav").style.width = "250px";
		//document.getElementById("main").style.marginLeft = "250px";
		document.getElementById("mySidenav").classList.add("menu-active");
		document.getElementById("main").classList.add("main-menu-active");
		document.getElementById("menu_overlay").classList.add("overlay-show");
		//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

	}

	closeNav() {
		//document.getElementById("mySidenav").style.width = "0";
		//document.getElementById("main").style.marginLeft = "0";
		document.getElementById("mySidenav").classList.remove("menu-active");
		document.getElementById("main").classList.remove("main-menu-active");
		document.getElementById("menu_overlay").classList.remove("overlay-show");
	}

	toggleNav() {
		document.getElementById("mySidenav").classList.toggle("menu-toggled");
		document.getElementById("main").classList.toggle("main-menu-toggled");
	}

}
