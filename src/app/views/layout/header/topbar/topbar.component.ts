import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// RxJS
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
	user: any;
	title: string;
	
	constructor(
		private translate: TranslateService, 
		private authenticationService: AuthenticationService, 
		private cDRef: ChangeDetectorRef, 
		private titleService: Title,
		private router: Router,
    private activatedRoute: ActivatedRoute,
	) {
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => {
				let route = this.activatedRoute;
				while (route.firstChild) route = route.firstChild;
				console.log('route');
				return route;
			}),
			filter((route) => route.outlet === 'primary'),
			mergeMap((route) => route.data),
			map((data) => {
				console.log(data);
				if ( data.title ) {
					return data.title;
				} else {
					return this.router.url.split('/').reduce((acc, frag) => {
						if ( acc && frag ) { acc += ' / '; }
						console.log(acc, frag)
						return acc + frag;
					});
				}
				//
			})
		).subscribe(val => {
			this.title = val;
			console.log(val);
			this.cDRef.markForCheck();
			translate.get(val).subscribe((translation:string) => {
				console.log(translation);
				this.titleService.setTitle(translation);
			});
			
		});
	}

	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
		
	}
	
	
}
