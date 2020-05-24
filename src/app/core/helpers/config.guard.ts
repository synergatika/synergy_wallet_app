import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {    // this will be passed from the route config

        // on the data property
        const accessIndex = route.data.accessIndex;
        console.log(route.data.redirectURL)
        if (environment.access[accessIndex] === true) {
            return true;
        }
        this.router.navigate([route.data.redirectURL || '/']);
        return false;

        // if (currentUser && (currentUser.user["access"] === expectedRole)) {
        //     // authorised so return true
        //     return true;
        // } else if (currentUser && (currentUser.user["access"] !== expectedRole)) {
        //     this.router.navigate(['']);
        //     return false;
        // } else if (!currentUser) {
        //     this.router.navigate(['']);//, { queryParams: { returnUrl: state.url }});
        //     return false;
        // }
    }
}