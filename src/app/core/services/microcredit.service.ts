import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import {
  Activity,
  Message,
  MicrocreditSupport,
  PaymentDetails,
  MicrocreditTransaction,
} from 'sng-core';


@Injectable({
  providedIn: 'root'
})

export class MicrocreditService {

  constructor(
    private http: HttpClient
  ) { }


  readBadge(): Observable<Activity> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/badge`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllBackerSupports(offset: string): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllSupportsByMicrocreditCampaign(partner_id: string, campaign_id: string): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports/${partner_id}/${campaign_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBackerSupportsByMicrocreditCampaign(partner_id: string, campaign_id: string, identifier: string): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports/${partner_id}/${campaign_id}/${identifier}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  confirmPayment(partner_id: string, campaign_id: string, support_id: string): Observable<PaymentDetails> {
    return this.http.put<any>(`${environment.apiUrl}/microcredit/confirm/${partner_id}/${campaign_id}/${support_id}`, {})
      .pipe(map(response => {
        return response.data;
      }));
  }

  readTransactions(offset: string): Observable<MicrocreditTransaction[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/transactions/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  earnTokens(partner_id: string, campaign_id: string, _amount: number, method: string, paid: boolean): Observable<PaymentDetails> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/earn/${partner_id}/${campaign_id}`, { _amount: _amount, method: method, paid: paid })
      .pipe(map(response => {
        return response.data;
      }));
  }

  earnTokensByPartner(partner_id: string, campaign_id: string, identifier: string, _amount: number, method: string, paid: boolean): Observable<PaymentDetails> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/earn/${partner_id}/${campaign_id}/${identifier}`, { _amount: _amount, method: method, paid: paid })
      .pipe(map(response => {
        return response.data;
      }));
  }

  redeemTokens(partner_id: string, campaign_id: string, _to: string, _tokens: number, password: string, support_id: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/redeem/${partner_id}/${campaign_id}/${support_id}`, { _tokens })
      .pipe(map(response => {
        return response;
      }));
  }
}
