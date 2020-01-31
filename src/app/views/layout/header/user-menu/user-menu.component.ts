import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
	icon: string = './assets/media/images/menu.svg' ;
	
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
}
