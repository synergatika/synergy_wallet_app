// Core
import { Injectable } from '@angular/core';

// Common
import { HttpClient } from '@angular/common/http';

// Rxjs
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Env
import { environment } from '../../../environments/environment';

// Models
import { AuthUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthUser>;
  public currentUser: Observable<AuthUser>;

  constructor(
    private http: HttpClient,
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

  authenticate(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, { email, password })
      .pipe(map(data => {
        return data;
      }));
  }

  register(name: string, email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(map(data => {
        return data;
      }));
  }

  register_customer(email?: string, card?: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register/customer`, { email: email, card: card })
      .pipe(map(data => {
        return data;
      }));
  }

  register_merchant(access: string, name: string, email: string, sector?: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register/${access}`, { name, email, sector })
      .pipe(map(data => {
        return data;
      }));
  }

  change_pass(oldPassword: string, newPassword: string) {
    return this.http.put<any>(`${environment.apiUrl}/auth/change_pass`, { oldPassword, newPassword })
      .pipe(map(data => {
        return data;
      }));
  }

  verification_askEmail(email: string) {
    return this.http.get<any>(`${environment.apiUrl}/auth/verify_email/${email}`)
      .pipe(map(data => {
        return data;
      }));
  }

  verification_checkToken(token: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/verify_email/`, { token })
      .pipe(map(data => {
        return data;
      }));
  }

  restoration_askEmail(email: string) {
    return this.http.get<any>(`${environment.apiUrl}/auth/forgot_pass/${email}`)
      .pipe(map(data => {
        return data;
      }));
  }

  restoration_checkToken(token: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot_pass/`, { token })
      .pipe(map(data => {
        return data;
      }));
  }

  restoration_updatePass(token: string, newPassword: string, verPassword: string) {
    return this.http.put<any>(`${environment.apiUrl}/auth/forgot_pass/`, { token, newPassword, verPassword })
      .pipe(map(data => {
        return data;
      }));
  }

  change_password(oldPassword: string, newPassword: string) {
    return this.http.put<any>(`${environment.apiUrl}/auth/change_pass/`, { oldPassword, newPassword })
      .pipe(map(data => {
        return data;
      }));
  }

  set_password(email: string, oldPassword: string, newPassword: string) {
    console.log(email, oldPassword, newPassword)
    return this.http.put<any>(`${environment.apiUrl}/auth/set_pass/${email}`, { oldPassword, newPassword })
      .pipe(map(data => {
        return data;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}