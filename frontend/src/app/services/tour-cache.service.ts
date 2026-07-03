import { Injectable } from '@angular/core';
import { RouteCalculationResponse } from '../api/models';
@Injectable({
  providedIn: 'root'
})
export class TourCacheService {
  private routeCache = new Map<string, RouteCalculationResponse>();

  generateKey(start: string, end: string, transport: string): string {
    return `${start.trim().toLowerCase()}_${end.trim().toLowerCase()}_${transport}`;
  }

  getRoute(key: string): RouteCalculationResponse | undefined {
    return this.routeCache.get(key);
  }

  saveRoute(key: string, routeData: RouteCalculationResponse): void {
    this.routeCache.set(key, routeData);
  }

  clearCache(): void {
    this.routeCache.clear();
  }
}