// Core
import { Injectable } from '@angular/core';

// Common
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

// Env
import { environment } from '../../../environments/environment';

// Models
import { Message } from '../models/message.model';
import { Points } from '../models/points.model';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {

  constructor(
    private http: HttpClient
  ) { }

  checkIdentifier(identifier: string) {
    return this.http.get<any>(`${environment.apiUrl}/auth/check_identifier/${identifier}`)
      .pipe(map(data => {
        return data;
      }));
  }

  linkCard(email: string, card: string) {
    return this.http.put<any>(`${environment.apiUrl}/auth/link_card/${email}`, { card: card })
      .pipe(map(data => {
        return data;
      }));
  }

  linkEmail(email: string, card: string) {
    return this.http.put<any>(`${environment.apiUrl}/auth/link_email/${card}`, { email: email })
      .pipe(map(data => {
        return data;
      }));
  }

  readBalance(): Observable<Points> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/balance`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBadge(): Observable<Points> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/badge`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBalanceByMerchant(_to: string) {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/balance/${_to}`)
      .pipe(map(response => {
        return response;
      }));
  }

  readBadgeByMerchant(_to: string) {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/badge/${_to}`)
      .pipe(map(response => {
        return response;
      }));
  }

  readTransactions(): Observable<Transaction[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/transactions`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  earnPoints(_to: string, _amount: number, password: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/earn`, { _to, _amount, password })
      .pipe(map(data => {
        return data;
      }));
  }

  redeemPoints(_to: string, _points: number, password: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/redeem`, { _to, _points, password })
      .pipe(map(data => {
        return data;
      }));
  }
}
