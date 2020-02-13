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
import { Offer } from '../models/offer.model';
import { Post } from '../models/post.model';
import { Event } from '../models/event.model';
import { Message } from '../models/message.model';
import { MicrocreditCampaign } from '../models/microcredit_campaigns.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(
    private http: HttpClient,
  ) { }

  /** 
    * Offers
    */
  readAllOffers(): Observable<Offer[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readOffersByStore(merchant_id: string): Observable<Offer[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createOffer(description: string, cost: number, expiresAt: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/offers`, { description, cost, expiresAt })
      .pipe(map(data => {
        return data;
      }));
  }

  /** 
    * Events
    */
  readAllPrivateEvents(): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllPublicEvents(): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/public/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivateEventsByStore(merchant_id: string): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPublicEventsByStore(merchant_id: string): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/public/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createEvent(content: string, type: number, access: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/community`, { content, type, access })
      .pipe(map(response => {
        return response;
      }));
  }

  /** 
  * Posts
  */
  readAllPrivatePosts(): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllPublicPosts(): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/public/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivatePostsByStore(merchant_id: string): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPublicPostsByStore(merchant_id: string): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/public/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createPost(content: string, type: number, access: string): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/community`, { content, type, access })
      .pipe(map(response => {
        return response;
      }));
  }

  /** 
    * Microcredit Campaigns
    */
  readAllMicrocreditCampaigns(): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllMicrocreditCampaignsByStore(merchant_id: string): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createMicrocreditCampaign(content: string, type: number, access: string): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/community`, { content, type, access })
      .pipe(map(response => {
        return response;
      }));
  }
}
