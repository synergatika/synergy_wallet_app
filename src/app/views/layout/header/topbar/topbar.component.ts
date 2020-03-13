import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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
	@ViewChild('header', {static: true}) htmlTitle: ElementRef;
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
			})
		).subscribe(val => {this.title = val;console.log(val)});
	}

	ngOnInit() {
		this.user = this.authenticationService.currentUserValue.user;
		//console.log(this.titleService.getTitle());
		
		//this.titleService.setTitle(this.htmlTitle.nativeElement.innerText);
		this.cDRef.markForCheck();	
	}
	
	ngAfterContentInit(){
		console.log(this.htmlTitle);
		console.log(this.htmlTitle.nativeElement);
		console.log(this.htmlTitle.nativeElement.textContent);
		console.log(this.htmlTitle.nativeElement.innerText);
    this.titleService.setTitle(this.htmlTitle.nativeElement.innerText);
  }
	
}
