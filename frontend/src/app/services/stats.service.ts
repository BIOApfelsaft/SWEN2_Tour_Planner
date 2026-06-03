import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DashboardStatistic } from '../models/stat.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  // Mockdata
  private mockStats: DashboardStatistic[] = [
    { icon: 'explore', label: 'Total Tours', value: '24' },
    { icon: 'directions_walk', label: 'Distance', value: '352 km' },
    { icon: 'landscape', label: 'Average Rating', value: '4.8' },
    { icon: 'timer', label: 'Time Active', value: '168 hrs' }
  ];

  getDashboardStats(): Observable<DashboardStatistic[]> {
    return of(this.mockStats).pipe(delay(300));
  }
}