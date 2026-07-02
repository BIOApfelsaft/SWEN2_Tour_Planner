import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration } from '../api/api-configuration';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { TourResponse } from '../api/models/tour-response';
import { CreateTourRequest } from '../api/models/create-tour-request';
import { apiTourGet$Json } from '../api/fn/tour/api-tour-get-json';
import { apiTourPost$Json } from '../api/fn/tour/api-tour-post-json';
import { apiTourIdDelete } from '../api/fn/tour/api-tour-id-delete';
import { apiTourIdPut } from '../api/fn/tour/api-tour-id-put';

@Injectable({
  providedIn: 'root'
})
export class TourStateService {
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);

  // Centralized state for tours, can be used across components
  tours = signal<TourResponse[]>([]);

  loadTours(): void {
    apiTourGet$Json(this.http, this.config.rootUrl).subscribe({
      next: (data) => this.tours.set(data.body || []),
      error: (err) => console.error('Fehler beim Laden der Touren:', err)
    });
  }

  createTour(newTour: CreateTourRequest): Observable<TourResponse> {
    return apiTourPost$Json(this.http, this.config.rootUrl, { body: newTour }).pipe(
      map((response) => response.body as TourResponse),
      tap((tour) => {
        this.tours.update(currentTours => [...currentTours, tour]);
      })
    );
  }

  updateTour(id: number, updatedTour: CreateTourRequest): Observable<any> {
    return apiTourIdPut(this.http, this.config.rootUrl, { id, body: updatedTour }).pipe(
      tap(() => {
        this.loadTours();
      })
    );
  }

  deleteTour(tourId: number): Observable<any> {
    console.log(`Deleting tour with ID: ${tourId}`);
    return apiTourIdDelete(this.http, this.config.rootUrl, { id: tourId }).pipe(
      tap(() => {
        this.tours.update(currentTours => currentTours.filter(t => t.id !== tourId));
      })
    );
  }
}