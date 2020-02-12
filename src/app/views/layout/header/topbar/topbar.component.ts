<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../core/services/authentication.service';

>>>>>>> origin/kel

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
<<<<<<< HEAD

	
	constructor() { }

	ngOnInit() {
=======
	user: any;
	
	constructor(private authenticationService: AuthenticationService, private cDRef: ChangeDetectorRef) { }

	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
		console.log(this.user);
		this.cDRef.markForCheck();	
>>>>>>> origin/kel
	}
	
}
