// Core
import { Injectable } from '@angular/core';

// Common
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

// Env
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaticContentService {

  constructor(
    private http: HttpClient
  ) { }

  readText(post_id: string) {
    return this.http.get(`${environment.staticUrl}/pages/${post_id}`)
      .pipe(
        tap(
          data => data,
          error => {
            console.log("error");
            console.log(error);
          }
        )
      );
  }
}
