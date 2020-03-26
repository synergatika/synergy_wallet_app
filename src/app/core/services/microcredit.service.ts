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
import { MicrocreditSupport } from '../models/microcredit-support.model';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})

export class MicrocreditService {

  constructor(
    private http: HttpClient
  ) { }


  readAllBackerSupports(): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllSupportsByMicrocreditCampaign(merchant_id: string, campaign_id: string): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports/${merchant_id}/${campaign_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readBackerSupportsByMicrocreditCampaign(merchant_id: string, campaign_id: string, identifier: string): Observable<MicrocreditSupport[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/supports/${merchant_id}/${campaign_id}/${identifier}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  confirmPayment(merchant_id: string, campaign_id: string, support_id: string): Observable<Payment> {
    return this.http.put<any>(`${environment.apiUrl}/microcredit/confirm/${merchant_id}/${campaign_id}/${support_id}`, {})
      .pipe(map(response => {
        return response.data;
      }));
  }

  // unConfirmPayment(merchant_id: string, campaign_id: string, payment: string, payment_id: string[]): Observable<Payment> {
  //   return this.http.put<any>(`${environment.apiUrl}/microcredit/supports/${merchant_id}/${campaign_id}/${payment}`, { payment_id: payment_id })
  //     .pipe(map(response => {
  //       return response.data;
  //     }));
  // }

  earnTokens(merchant_id: string, campaign_id: string, _amount: number, method: string): Observable<Payment> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/earn/${merchant_id}/${campaign_id}`, { _amount: _amount, method: method })
      .pipe(map(response => {
        return response.data;
      }));
  }

  earnTokensByMerchant(merchant_id: string, campaign_id: string, identifier: string, _amount: number, method: string, paid: boolean): Observable<Payment> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/earn/${merchant_id}/${campaign_id}/${identifier}`, { _amount: _amount, method: method, paid: paid })
      .pipe(map(response => {
        return response.data;
      }));
  }

  redeemTokens(merchant_id: string, campaign_id: string, _to: string, _tokens: number, password: string, support_id: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/redeem/${merchant_id}/${campaign_id}/${support_id}`, { _tokens })
      .pipe(map(response => {
        return response;
      }));
  }
}
