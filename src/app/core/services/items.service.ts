// Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Offer,
  Event,
  Message,
  Post,
  MicrocreditCampaign,
  PostEvent,
  IItemsService
} from 'sng-core';

/**
 * Environment
 */
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends IItemsService {

  constructor(
    private http: HttpClient,
  ) {
    super();
  }

  /**
    * Offers
    */
  readAllOffers(offset: string): Observable<Offer[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/public/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readOffersByStore(partner_id: string, offset: string): Observable<Offer[]> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/public/${partner_id}/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createOffer(formData: FormData): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/loyalty/offers/`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  editOffer(partner_id: string, offer_id: string, formData: FormData): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/loyalty/offers/${partner_id}/${offer_id}`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  readOffer(partner_id: string, offer_id: string): Observable<Offer> {
    return this.http.get<any>(`${environment.apiUrl}/loyalty/offers/${partner_id}/${offer_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  deleteOffer(partner_id: string, offer_id: string): Observable<Offer> {
    return this.http.delete<any>(`${environment.apiUrl}/loyalty/offers/${partner_id}/${offer_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  /**
    * Events
    */
  readAllPrivateEvents(offset: string): Observable<Event[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivateEventsByStore(partner_id: string, offset: string): Observable<Event[]> {
    // return this.http.get<any>(`${environment.apiUrl}/community/private/${partner_id}`)
    return this.http.get<any>(`${environment.apiUrl}/events/private/${partner_id}/${offset}`)
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

  readEvent(partner_id: string, post_id: string): Observable<Event> {
    return this.http.get<any>(`${environment.apiUrl}/events/${partner_id}/${post_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  editEvent(partner_id: string, event_id: string, formData: FormData): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/events/${partner_id}/${event_id}`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteEvent(partner_id: string, event_id: string): Observable<Offer> {
    return this.http.delete<any>(`${environment.apiUrl}/events/${partner_id}/${event_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  /**
    * Posts
    */
  readAllPrivatePosts(offset: string): Observable<Post[]> {
    return this.http.get<any>(`${environment.apiUrl}/posts/private/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivatePostsByStore(partner_id: string, offset: string): Observable<Post[]> {
    //return this.http.get<any>(`${environment.apiUrl}/community/private/${partner_id}`)
    return this.http.get<any>(`${environment.apiUrl}/posts/private/${partner_id}/${offset}`)
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

  readPost(partner_id: string, post_id: string): Observable<Post> {
    return this.http.get<any>(`${environment.apiUrl}/posts/${partner_id}/${post_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  editPost(partner_id: string, post_id: string, formData: FormData): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/posts/${partner_id}/${post_id}`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  deletePost(partner_id: string, post_id: string): Observable<Offer> {
    return this.http.delete<any>(`${environment.apiUrl}/posts/${partner_id}/${post_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  /**
    * Posts & Events
    */

  readAllPrivatePostsEvents(offset: string): Observable<PostEvent[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivatePostsEventsByStore(partner_id: string, offset: string): Observable<PostEvent[]> {
    return this.http.get<any>(`${environment.apiUrl}/community/private/${partner_id}/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  /**
   * Microcredit Campaigns
   */
  readAllPrivateMicrocreditCampaigns(offset: string): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/campaigns/private/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  readPrivateMicrocreditCampaignsByStore(partner_id: string, offset: string): Observable<MicrocreditCampaign[]> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/campaigns/private/${partner_id}/${offset}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  oneClickCreateMicrocreditCampaign(formData: FormData, token: string): Observable<Message> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/campaigns/one-click/${token}`, formData)
      .pipe(map(response => {
        return response.data;
      }));
  }

  createMicrocreditCampaign(formData: FormData): Observable<MicrocreditCampaign> {
    return this.http.post<any>(`${environment.apiUrl}/microcredit/campaigns`, formData)
      .pipe(map(response => {
        return response.data;
      }));
  }

  editCampaign(partner_id: string, campaign_id: string, formData: FormData): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/microcredit/campaigns/${partner_id}/${campaign_id}`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  publishCampaign(partner_id: string, campaign_id: string, formData: FormData): Observable<Message> {
    return this.http.put<any>(`${environment.apiUrl}/microcredit/campaigns/${partner_id}/${campaign_id}/publish`, formData)
      .pipe(map(data => {
        return data;
      }));
  }

  readCampaign(partner_id: string, campaign_id: string): Observable<MicrocreditCampaign> {
    return this.http.get<any>(`${environment.apiUrl}/microcredit/campaigns/${partner_id}/${campaign_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  deleteCampaign(partner_id: string, campaign_id: string): Observable<Message> {
    return this.http.delete<any>(`${environment.apiUrl}/microcredit/campaigns/${partner_id}/${campaign_id}`)
      .pipe(map(response => {
        return response.data;
      }));
  }

}
