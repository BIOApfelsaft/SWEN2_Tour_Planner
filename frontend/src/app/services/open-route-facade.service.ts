import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface RouteCalculationResult {
  distance: number;
  estimatedTime: number;
  geoJson: any;
}

@Injectable({
  providedIn: 'root'
})
export class OpenRouteFacadeService {
  // Mockdata
  calculateRoute(start: string, end: string, type: string): Observable<RouteCalculationResult> {
    const mockResult: RouteCalculationResult = {
      distance: Math.floor(Math.random() * 50) + 5,
      estimatedTime: Math.floor(Math.random() * 14400) + 3600,
      geoJson: null
    };

    return of(mockResult).pipe(delay(800));
  }
}