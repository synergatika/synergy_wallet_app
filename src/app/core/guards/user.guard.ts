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

        function accessRoute(access: string) {
            switch (access) {
                case 'member':
                    return 'explore';
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