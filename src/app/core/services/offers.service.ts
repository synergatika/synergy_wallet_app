import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(
    private http: HttpClient
  ) { }

  readAllOffers() {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/`)
      .pipe(map(data => {
        return data;
      }));
  }

  readOffersByStore(merchant_id: string): Observable<Offer[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createOffer(description: string, cost: number, expiresAt: string) {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/offers`, { description, cost, expiresAt })
      .pipe(map(data => {
        return data;
      }));
  }

}
