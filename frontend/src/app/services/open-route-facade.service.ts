import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfiguration } from '../api/api-configuration';

import { apiTourCalculateGet$Json } from '../api/fn/tour/api-tour-calculate-get-json';
import { RouteCalculationResponse } from '../api/models/route-calculation-response';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteFacadeService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  calculateRoute(start: string, end: string, transportType: string): Observable<RouteCalculationResponse> {
    return apiTourCalculateGet$Json(this.http, this.config.rootUrl, { 
      start: start, 
      end: end, 
      transportType: transportType,
    }) .pipe(
      map(response => response.body as RouteCalculationResponse)
    );
  }
}