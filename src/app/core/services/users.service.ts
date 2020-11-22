// Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

import { User, Message } from 'sng-core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  readUsers(access: string, offset: string): Observable<User[]> {
    return this.http.get<any>(`${environment.apiUrl}/users/${access}/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  reactivateUser(user_id: string): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/users/reactivate/${user_id}`, {})
      .pipe(map(response => {
        return response;
      }));
  }
}
