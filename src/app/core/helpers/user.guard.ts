import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        const expectedRole = route.data.expectedRole;
        const accessIndex = route.data.accessIndex;

        function accessRoute(access: string) {
            switch (access) {
                case 'member':
                    return 'dashboard';
                    break;
                case 'partner':
                    return 'scanner';
                    break;
                case 'admin':
                    return 'a-partners';
                    break;
                default:
                    return '/auth/login';
                    break;
            }
        }
        // if (!accessIndex || !environment.access[accessIndex]) {
        //     return false;
        // }

        if (currentUser && (currentUser.user["access"] === expectedRole)) {
            return true;
        } else if (currentUser && (currentUser.user["access"] !== expectedRole)) {
            this.router.navigate([accessRoute(currentUser.user["access"])]);
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
    // if (currentUser.user.access == "partner") {
    //     //console.log('partner');
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
