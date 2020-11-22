// Core
import { Injectable } from '@angular/core';

// Common
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Env
import { environment } from '../../../environments/environment';

// Models
import {
  Message,
  AuthUser,
  VerificationRequired,
  RegistrationStatus,
  OneClickToken,
} from 'sng-core';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthUser>;
  public currentUser: Observable<AuthUser>;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  updateCurrentUser(name: string, imageURL: string) {

    // Get the existing data
    var existing = localStorage.getItem('currentUser');

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? JSON.parse(existing) : {};

    // Add new data to localStorage Array
    existing['user'].name = name;
    existing['user'].imageURL = imageURL;

    // Save back to localStorage
    localStorage.setItem('currentUser', JSON.stringify(existing));
  }

  setCurrentUserValue(user: AuthUser) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  checkIdentifier(identifier: string): Observable<RegistrationStatus> {
    return this.http.get<any>(`${environment.apiUrl}/auth/check_identifier/${identifier}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  linkCard(email: string, card: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/link_card/${email}`, { card: card })
      .pipe(map(response => {
        return response;
      }));
  }

  linkEmail(email: string, card: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/link_email/${card}`, { email: email })
      .pipe(map(response => {
        return response;
      }));
  }

  authenticate(email: string, password: string): Observable<AuthUser> {
    return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, { email, password })
      .pipe(map(response => {
        console.log(response.data);
        return response.data;
      }));
  }

  register_as_member(name: string, email: string, password: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/auth/auto-register/member`, { name, email, password })
      .pipe(map(response => {
        return response;
      }));
  }

  register_as_partner(formData: FormData): Observable<OneClickToken> {
    return this.http.post<any>(`${environment.apiUrl}/auth/auto-register/partner`, formData)
      .pipe(map(response => {
        return response.data;
      }));
  }

  register_member(email?: string, card?: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register/member`, { email: email, card: card })
      .pipe(map(response => {
        return response;
      }));
  }

  register_partner(formData: FormData): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/auth/register/partner`, formData)
      .pipe(map(response => {
        return response;
      }));
  }

  change_pass(oldPassword: string, newPassword: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/change_pass`, { oldPassword, newPassword })
      .pipe(map(response => {
        return response;
      }));
  }

  verification_askEmail(email: string): Observable<Message> {
    return this.http.get<any>(`${environment.apiUrl}/auth/verify_email/${email}`)
      .pipe(map(response => {
        return response;
      }));
  }

  verification_checkToken(token: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/auth/verify_email/`, { token })
      .pipe(map(response => {
        return response;
      }));
  }

  restoration_askEmail(email: string): Observable<Message> {
    return this.http.get<any>(`${environment.apiUrl}/auth/forgot_pass/${email}`)
      .pipe(map(response => {
        return response;
      }));
  }

  restoration_checkToken(token: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot_pass/`, { token })
      .pipe(map(response => {
        return response;
      }));
  }

  restoration_updatePass(token: string, newPassword: string, verPassword: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/forgot_pass/`, { token, newPassword, verPassword })
      .pipe(map(response => {
        return response;
      }));
  }

  change_password(oldPassword: string, newPassword: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/change_pass/`, { oldPassword, newPassword })
      .pipe(map(response => {
        return response;
      }));
  }

  set_password(email: string, oldPassword: string, newPassword: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/set_pass/${email}`, { oldPassword, newPassword })
      .pipe(map(response => {
        return response;
      }));
  }

  deactivate(reason: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/auth/deactivate`, { reason })
      .pipe(map(response => {
        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/auth/login');
  }
}
