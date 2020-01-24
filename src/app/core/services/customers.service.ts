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
import { Customer } from '../models/customer.model'

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private http: HttpClient
  ) { }

  readProfile(): Observable<Customer> {
    return this.http.get<any>(`${environment.apiUrl}/profile`)
      .pipe(map(response => {
        return response.data;
      }));
  }

  updateProfile(formData: FormData): Observable<Customer> {
    return this.http.put<any>(`${environment.apiUrl}/profile`, formData)
      .pipe(map(response => {
        return response.data;
      }));
  }
}
