import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../../../../core/services/menu.service';
// RxJS
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../core/services/authentication.service';
// Models
import { AuthUser } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
	icon: string = './assets/media/images/menu.svg' ;
	user: any;
	userAvatar: string;
	
	constructor(private menuService : MenuService,private authenticationService: AuthenticationService, private cDRef: ChangeDetectorRef) { }

	ngOnInit(): void {
		this.user = this.authenticationService.currentUserValue.user;
		console.log(this.user);
		this.userAvatar = this.user.imageURL || '../../../../assets/media/users/default.jpg';
		this.cDRef.markForCheck();			
	}
	
	openNav() {
		this.menuService.openNav();
		/*document.getElementById("mySidenav").style.width = "250px";
		document.getElementById("main").style.marginLeft = "250px";
		//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
		document.body.classList.add("menu-overlay");*/
	}
	
	logout() {
		console.log('logout');
		this.authenticationService.logout();
	}
}
