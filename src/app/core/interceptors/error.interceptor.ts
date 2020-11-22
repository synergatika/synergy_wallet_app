import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let error: string;

            if (err.status === 400) {
                error = 'HTTP_ERRORS.BAD_REQUEST';
            } else if (err.status === 401) {
                error = 'HTTP_ERRORS.UNAUTHORIZED';
                this.authenticationService.logout();
                location.reload(true);
            } else if (err.status === 403) {
                error = 'HTTP_ERRORS.FORBIDDEN';
            } else if (err.status === 404) {
                error = 'NOT_FOUND_ERRORS.' + err.error.message.split('Not Found: ')[1];// || err.statusText;
            } else if (err.status === 422) {
                console.log(err);
                error = 'HTTP_ERRORS.UNPROCESSABLE_ENTITY';
            } else if (err.status >= 500) {
                error = 'HTTP_ERRORS.SERVER';
            } else {
                error = err.error.message || err.statusText;
            }
            return throwError(error);
            //return throwError(err.status.toString() + " : " + JSON.stringify(err) + " : " + error);
        }))
    }
}