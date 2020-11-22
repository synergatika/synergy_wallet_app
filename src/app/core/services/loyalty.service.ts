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
import {
  Activity,
  Points,
  LoyaltyTransaction,
  Message,
  Statistics
} from 'sng-core';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {

  constructor(
    private http: HttpClient
  ) { }


  readBalance(): Observable<Points> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/balance`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBadge(): Observable<Activity> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/badge`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBalanceByPartner(_to: string): Observable<Points> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/balance/${_to}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBadgeByPartner(_to: string): Observable<Activity> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/badge/${_to}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readTransactions(offset: string): Observable<LoyaltyTransaction[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/transactions/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  earnPoints(_to: string, password: string, _amount: number): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/earn/${_to}`, { password, _amount })
      .pipe(map(data => {
        return data;
      }));
  }

  redeemPoints(_to: string, password: string, _points: number): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/redeem/${_to}`, { password, _points })
      .pipe(map(data => {
        return data;
      }));
  }

  redeemOffer(partner_id: string, offer_id: string, _to: string, password: string, _points: number, quantity: number): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/redeem/${partner_id}/${offer_id}/${_to}`, { password, _points, quantity })
      .pipe(map(data => {
        return data;
      }));
  }

  readStatistics(): Observable<Statistics> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/statistics`)
      .pipe(map(response => {
        return response.data;
      }));
  }
}
