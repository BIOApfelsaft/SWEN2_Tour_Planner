import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

import { apiTourCalculateGet } from '../api/fn/tour/api-tour-calculate-get';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteFacadeService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  calculateRoute(start: string, end: string, transportType: string): Observable<any> {
    
    return apiTourCalculateGet(this.http, this.config.rootUrl, { 
      start: start, 
      end: end, 
      transportType: transportType 
    });
    
  }
}