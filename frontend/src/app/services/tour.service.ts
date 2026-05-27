import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TourOverview } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private mockTours: TourOverview[] = [
  {
      id: '1',
      title: 'Mont Blanc Circuit',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT2BlJfDjwB42Qzs6Funm_DZcVSaSFOB3qnVs6W9BrrI8bUTMRH54qRDj_mHyzKywA4AXgmHKxvCwszmbabqpD24O4H3WLgz9jyPX6BZFruTm4gY7zyzUiSU4RBb0EaHBN3J4tMOG26F5TGKeYZBeS7ieb1x2SjkHCye_e-dMjcabsdzP9nJ2Oq-unYF-ZOh6ICWldJFji4b_etj1PtugzwhKvR3NNeXYaxrSgFXZutUSpKldj0km14asEZ6FA0ol1C7g7fKOFWmxA',
      location: 'Chamonix, France',
      type: 'Hiking',
      comment: 'A classic alpine trek around the Mont Blanc massif.',
      distance: '172 km',
      date: 'Aug 12',
      difficulty: 'Hard',
      time: '10 days',
      rating: 4.8,
      popularity: 95,
      childfriendly: false,
    },
    {
      id: '2',
      title: 'Slickrock Trail Expedition',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ghgfyUx5wuwa7dB57-678faKyJwuIeK_CI-jdL-Z2ruZfcBdvAWTmRa9NyjNOb9rohMcBXQF0WgC-aXMKfjNpouZQLI4kVob9ow9LzYffxXnwQLjVkKd2ygqHW3WZTLGmGTexWvMDvgS-1A0nSs9dF1G9XpQkBgiKoRIXNHkQHTs-0z_2wSiOignqaTcRc0gGhgA3asiIsLUTJfvDZqmRSzf-Tn1P6mHtPB85m5yq-KfQ8Oi7EvXKSXGd9Zdokso6wbF71rtQTrx',
      location: 'Moab, Utah',
      type: 'MTB',
      comment: 'A thrilling mountain biking adventure through the iconic red rock formations.',
      distance: '17 km',
      date: 'Sep 04',
      difficulty: 'Medium',
      time: '4 hrs',
      rating: 4.5,
      popularity: 87,
      childfriendly: false,
    }
  ];

  getPlannedTours(): Observable<TourOverview[]> {
    return of(this.mockTours).pipe(delay(500));
  }
}