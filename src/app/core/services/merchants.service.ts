// Core
import { Injectable } from '@angular/core';

// Common
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Env
import { environment } from '../../../environments/environment';

// Models
import { Merchant } from '../models/merchant.model'

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {

  constructor(
    private http: HttpClient
  ) { }

  readMerchants(): Observable<Merchant[]> {
    return this.http.get<any>(`${environment.apiUrl}/merchants/public/0-0-0`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readMerchantInfo(merchant_id: string): Observable<Merchant> {
    return this.http.get<any>(`${environment.apiUrl}/merchants/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  updateMerchantInfo(merchant_id: string, formData: FormData): Observable<Merchant> {
    return this.http.put<any>(`${environment.apiUrl}/merchants/${merchant_id}`, formData)
      .pipe(map(response => {
        return response.data;
      }));
  }
}
