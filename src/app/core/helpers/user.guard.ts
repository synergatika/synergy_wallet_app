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
        const currentUser = this.authenticationService.currentUserValue;
        const expectedRole = route.data.expectedRole;

        if (currentUser && (currentUser.user["access"] === expectedRole)) {
            return true;
        } else if (currentUser && (currentUser.user["access"] !== expectedRole)) {
            if (currentUser.user["access"] === 'customer') {
                this.router.navigate(['dashboard']);
            } else if (currentUser.user["access"] === 'merchant') {
                this.router.navigate(['scanner']);
            } else if (currentUser.user["access"] === 'admin') {
                this.router.navigate(['a-merchants']);
            }
            return false;
        } else if (!currentUser) {
            this.router.navigate(['/auth/login']);//, { queryParams: { returnUrl: state.url }});
            return false;
        } else {
            return false;
        }
    }
}

    // const currentUser = this.authenticationService.currentUserValue;
    // if(currentUser === expectedRole) {
    // //console.log(currentUser);
    // if (currentUser.user.access == "merchant") {
    //     //console.log('merchant');
    //     this.router.navigate(['/scanner']);
    // } /*else {
    // 			console.log('else');
    // 			this.router.navigate(['/dashboard']);
    // 		}*/
    // // authorised so return true
    // return true;
// not logged in so redirect to login page with the return url
//, { queryParams: { returnUrl: state.url }});
//this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
