import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

/**
 * Models & Interfaces
 */
import { Message } from 'sng-core';

@Injectable({
  providedIn: 'root'
})

export class CommunicationService {

  constructor(
    private http: HttpClient
  ) { }


  sendInvitation(email: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/community/invite`, { receiver: email })
      .pipe(map(response => {
        return response;
      }));
  }
}
