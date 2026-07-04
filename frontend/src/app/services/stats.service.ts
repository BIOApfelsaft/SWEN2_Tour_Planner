import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiConfiguration } from '../api/api-configuration';

import { apiStatsDashboardGet$Json } from '../api/fn/stats/api-stats-dashboard-get-json';
import { StatItemResponse } from '../api/models/stat-item-response';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  getDashboardStats(): Observable<StatItemResponse[]> {
    return apiStatsDashboardGet$Json(this.http, this.config.rootUrl)
          .pipe(map((response) => response.body as StatItemResponse[]));
  }
}