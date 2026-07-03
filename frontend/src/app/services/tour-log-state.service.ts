import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../api/api-configuration';

import { TourLogResponse } from '../api/models/tour-log-response';
import { CreateTourLogRequest } from '../api/models/create-tour-log-request';
import { apiTourLogsTourTourIdGet$Json } from '../api/fn/tour-logs/api-tour-logs-tour-tour-id-get-json';
import { apiTourLogsMyLogsGet$Json } from '../api/fn/tour-logs/api-tour-logs-my-logs-get-json';
import { apiTourLogsPost$Json } from '../api/fn/tour-logs/api-tour-logs-post-json';
import { apiTourLogsIdPut } from '../api/fn/tour-logs/api-tour-logs-id-put';
import { apiTourLogsIdDelete } from '../api/fn/tour-logs/api-tour-logs-id-delete';
import { TourStateService } from './tour-state.service';

@Injectable({
  providedIn: 'root'
})
export class TourLogStateService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);
  private tourState = inject(TourStateService);
  
  // Centralized state for tour logs, can be used across components
  logs = signal<TourLogResponse[]>([]);

  loadLogsForTour(tourId: number): void {
    apiTourLogsTourTourIdGet$Json(this.http, this.config.rootUrl, { tourId })
      .subscribe(data => this.logs.set(data.body || []));
  }

  loadMyLogs(): void {
    apiTourLogsMyLogsGet$Json(this.http, this.config.rootUrl)
      .subscribe(data => this.logs.set(data.body || []));
  }

  addLog(newLog: CreateTourLogRequest): void {
    apiTourLogsPost$Json(this.http, this.config.rootUrl, { body: newLog }).subscribe(() => {
        this.loadLogsForTour(newLog.tourId as number);
        this.tourState.loadTours(); 
    });
  }

  updateLog(id: number, updatedLog: CreateTourLogRequest): void {
    apiTourLogsIdPut(this.http, this.config.rootUrl, { id, body: updatedLog }).subscribe(() => {
        this.loadLogsForTour(updatedLog.tourId as number);
        this.tourState.loadTours(); 
    });
  }

  deleteLog(id: number, tourId: number): void {
    apiTourLogsIdDelete(this.http, this.config.rootUrl, { id }).subscribe(() => {
        this.loadLogsForTour(tourId as number);
        this.tourState.loadTours(); 
    });
  }

  clearState(): void {
    this.logs.set([]);
  }
}