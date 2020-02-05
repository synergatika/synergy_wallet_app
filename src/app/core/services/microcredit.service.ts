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
import { MicrocreditBacker } from '../models/microcredit_backer.model';

@Injectable({
  providedIn: 'root'
})

export class MicrocreditService {

  constructor(
    private http: HttpClient
  ) { }


  readBacker(merchant_id: string, campaign_id: string): Observable<MicrocreditBacker> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/backers/${merchant_id}/${campaign_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readCustomerBacker(merchant_id: string, campaign_id: string, identifier: string): Observable<MicrocreditBacker> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/backers/${merchant_id}/${campaign_id}/${identifier}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createBacker(merchant_id: string, campaign_id: string, amount: number): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/backers/${merchant_id}/${campaign_id}`, { amount: amount })
      .pipe(map(response => {
        return response;
      }));
  }

  createCustomerBacker(merchant_id: string, campaign_id: string, identifier: string, amount: number): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/backers/${merchant_id}/${campaign_id}/${identifier}`, { amount: amount })
      .pipe(map(response => {
        return response;
      }));
  }

  confirmBacker(merchant_id: string, campaign_id: string, payment_id: string[]): Observable<Message[]> {
    return this.http.put<any>(`${environment.apiUrl}/microcredit/backers/${merchant_id}/${campaign_id}`, { payment_id: payment_id })
      .pipe(map(response => {
        return response;
      }));
  }
}
