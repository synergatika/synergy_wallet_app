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

  createOffer(formData: FormData): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/offers`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  /** 
    * Events
    */
  readAllPrivateEvents(): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/events/private/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllPublicEvents(): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/events/public/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivateEventsByStore(merchant_id: string): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/events/private/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPublicEventsByStore(merchant_id: string): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/events/public/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createEvent(formData: FormData): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/events`, formData)
      .pipe(map(response => {
        return response;
      }));
  }

  /** 
    * Posts
    */
  readAllPrivatePosts(): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/posts/private/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readAllPublicPosts(): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/posts/public/`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivatePostsByStore(merchant_id: string): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/posts/private/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPublicPostsByStore(merchant_id: string): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/posts/public/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createPost(formData: FormData): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/posts`, formData)
      .pipe(map(response => {
        return response;
      }));
  }

  /** 
   * Microcredit Campaigns
   */
  readAllPublicMicrocreditCampaigns(): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/campaigns/public`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPublicMicrocreditCampaignsByStore(merchant_id: string): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/campaigns/public/${merchant_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createMicrocreditCampaign(formData: FormData): Observable<Message[]> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/campaigns`, formData)
      .pipe(map(response => {
        return response;
      }));
  }
}
