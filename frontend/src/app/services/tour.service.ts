import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5134/api/Tour';

  // Mockdata
  private mockTours: Tour[] = [
  {
      id: 1,
      userId: 1,
      title: 'Mont Blanc Circuit',
      description: 'A breathtaking trek around the Mont Blanc massif, passing through France, Italy, and Switzerland.',
      startLocation: 'Chamonix, France',
      endLocation: 'Chamonix, France',
      transportType: 'Hiking',
      distance: 172,
      estimatedTime: 864000, // 10 days
      mapImagePath: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT2BlJfDjwB42Qzs6Funm_DZcVSaSFOB3qnVs6W9BrrI8bUTMRH54qRDj_mHyzKywA4AXgmHKxvCwszmbabqpD24O4H3WLgz9jyPX6BZFruTm4gY7zyzUiSU4RBb0EaHBN3J4tMOG26F5TGKeYZBeS7ieb1x2SjkHCye_e-dMjcabsdzP9nJ2Oq-unYF-ZOh6ICWldJFji4b_etj1PtugzwhKvR3NNeXYaxrSgFXZutUSpKldj0km14asEZ6FA0ol1C7g7fKOFWmxA',
      routeGeoJson: null, // Placeholder for actual GeoJSON data
      computedPopularityScore: 98,
      computedChildFriendlyScore: 5,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T12:00:00Z',
    },
    {
      id: 2,
      userId: 2,
      title: 'Lake District Loop',
      description: 'A scenic loop through the Lake District in England, featuring stunning lakes, mountains, and charming villages.',
      startLocation: 'Keswick, UK',
      endLocation: 'Keswick, UK',
      transportType: 'Hiking',
      distance: 130,
      estimatedTime: 432000, // 5 days
      mapImagePath: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT2BlJfDjwB42Qzs6Funm_DZcVSaSFOB3qnVs6W9BrrI8bUTMRH54qRDj_mHyzKywA4AXgmHKxvCwszmbabqpD24O4H3WLgz9jyPX6BZFruTm4gY7zyzUiSU4RBb0EaHBN3J4tMOG26F5TGKeYZBeS7ieb1x2SjkHCye_e-dMjcabsdzP9nJ2Oq-unYF-ZOh6ICWldJFji4b_etj1PtugzwhKvR3NNeXYaxrSgFXZutUSpKldj0km14asEZ6FA0ol1C7g7fKOFWmxA',
      routeGeoJson: null, // Placeholder for actual GeoJSON data
      computedPopularityScore: 40,
      computedChildFriendlyScore: 66,
      createdAt: '2024-02-10T09:30:00Z',
      updatedAt: '2024-02-15T11:45:00Z',
    }
  ];

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}`, localStorage.getItem('authToken') ? { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } } : {});
  }

  getTourById(id: number): Observable<Tour | undefined> {
    const tour = this.mockTours.find(t => t.id === id);
    return of(tour).pipe(delay(300));
  }

createTour(newTour: Partial<Tour>): Observable<Tour> {
    const nextId = Math.max(...this.mockTours.map(t => t.id), 0) + 1;
    
    const tourToSave: Tour = {
      ...newTour,
      id: nextId,
      userId: 1,
      mapImagePath: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600', // Default Map Bild
      computedPopularityScore: 0,
      computedChildFriendlyScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Tour;

    this.mockTours.push(tourToSave);
    
    return of(tourToSave).pipe(delay(500));
  }

  deleteTour(tourId: number): Observable<boolean> {
    const index = this.mockTours.findIndex(t => t.id === tourId);
    if (index !== -1) {
      this.mockTours.splice(index, 1);
      return of(true).pipe(delay(400));
    }
    return of(false);
  }

  updateTour(tourId: number, updatedData: Partial<Tour>): Observable<Tour | null> {
    const index = this.mockTours.findIndex(t => t.id === tourId);
    if (index !== -1) {
      this.mockTours[index] = { ...this.mockTours[index], ...updatedData, updatedAt: new Date().toISOString() };
      return of(this.mockTours[index]).pipe(delay(400));
    }
    return of(null);
  }
}