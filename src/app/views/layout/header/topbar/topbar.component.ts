import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// RxJS
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../core/services/authentication.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
	user: any;
	
	constructor(private translate: TranslateService, private authenticationService: AuthenticationService, private cDRef: ChangeDetectorRef) { }

	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
		console.log(this.user);
		this.cDRef.markForCheck();	
	}
	
}
