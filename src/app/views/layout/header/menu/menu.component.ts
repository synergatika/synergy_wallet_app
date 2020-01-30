import { Component, OnInit } from '@angular/core';

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
		},
		{
			title: 'About',
			link: 'about',
		},
		{
			title: 'Events',
			link: 'events',
		},
		{
			title: 'Contact',
			link: 'contact',
		},
	];
	constructor() { }

	ngOnInit() {
	}

}
