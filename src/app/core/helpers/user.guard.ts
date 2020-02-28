import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		console.log('UserGuard');
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
			//console.log(currentUser);
			if(currentUser.user.access=="merchant") {
				//console.log('merchant');
				this.router.navigate(['/scanner']);
			} /*else {
				console.log('else');
				this.router.navigate(['/dashboard']);
			}*/
            // authorised so return true
			return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login']);//, { queryParams: { returnUrl: state.url }});
		//this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}