import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private translateService: TranslateService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = this.authenticationService.currentUserValue;
        if ((currentUser) && (currentUser.token['token'])) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token['token']}` || 'Bearer _none'
                }
            });
        }

        request = request.clone({
            setHeaders: {
                "content-language": `${this.translateService.currentLang}-${(this.translateService.currentLang).toUpperCase()}`
            }
        });

        return next.handle(request);
    }
}