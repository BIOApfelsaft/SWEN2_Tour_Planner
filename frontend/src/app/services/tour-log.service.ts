import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TourLog } from '../models/tour-log.model';

@Injectable({
  providedIn: 'root'
})
export class TourLogService {
  private mockLogs: TourLog[] = [
    {
      id: 1,
      tourId: 1, // Alpine Crossing
      logDateTime: '2023-10-12T08:00:00Z',
      comment: 'Incredible weather window. The scree field before the second pass was looser than expected. Brought extra water, which was a lifesaver. Highly recommend starting before 6 AM.',
      difficulty: 4,
      totalDistance: 172.5,
      totalTime: 804000, // Stored in seconds
      rating: 5,
      weatherCondition: 'Clear',
      temperature: 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      tourId: 1, // Alpine Crossing
      logDateTime: '2022-08-05T09:30:00Z',
      comment: 'Perfect conditions. The trail was well marked. Spotted some Ibex near the summit. The descent was hard on the knees, trekking poles are mandatory.',
      difficulty: 5,
      totalDistance: 173.2,
      totalTime: 864000, // Stored in seconds
      rating: 5,
      weatherCondition: 'Sunny',
      temperature: 18,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      tourId: 2, // Lake District Loop
      logDateTime: '2023-09-20T07:45:00Z',
      comment: 'Started with light rain, but it cleared up by midday. The views of the lakes were stunning. The section between Grasmere and Ambleside was particularly scenic.',
      difficulty: 2,
      totalDistance: 130,
      totalTime: 432000, // Stored in seconds
      rating: 4,
      weatherCondition: 'Rainy',
      temperature: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  getTourLogsForTourId(tourId: number): Observable<TourLog[]> {
    const filteredLogs = this.mockLogs.filter(log => log.tourId === tourId);
    return of(filteredLogs).pipe(delay(400));
  }
}