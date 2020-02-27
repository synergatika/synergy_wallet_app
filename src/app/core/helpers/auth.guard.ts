import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
			/*console.log(currentUser);
			if(currentUser.user.access=="merchant") {
				console.log('merchant');
				//this.router.navigate(['dashboard']);
			} else {
				//this.router.navigate(['/dashboard']);
			}*/
            // authorised so return true
			return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login']);//, { queryParams: { returnUrl: state.url }});
        return false;
    }
}