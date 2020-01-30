// Core
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

	constructor() {}

	openNav() {
		document.getElementById("mySidenav").style.width = "250px";
		document.getElementById("main").style.marginLeft = "250px";
		document.getElementById("menu_overlay").classList.add("overlay-show");
		//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
		//document.body.classList.add("menu-overlay");
		
	}
	
	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
		document.getElementById("main").style.marginLeft = "0";
		//document.body.classList.replace("menu-overlay", "");
		document.getElementById("menu_overlay").classList.remove("overlay-show");
		//document.body.classList.remove("menu-overlay");
	} 
	
}
