import { Component, signal } from '@angular/core';
import { StatisticCardComponent } from '../../components/statistic-card/statistic-card.component';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { DashboardStatistic, TourOverview } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticCardComponent, TourCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // State Management mit Signals (Mock Daten)
  statistics = signal<DashboardStatistic[]>([
    { icon: 'explore', label: 'Total Tours', value: '24' },
    { icon: 'directions_walk', label: 'Distance', value: '342 km' },
    { icon: 'landscape', label: 'Elevation', value: '12.4k m' },
    { icon: 'timer', label: 'Time Active', value: '86 hrs' }
  ]);

  plannedTours = signal<TourOverview[]>([
    {
      id: '1',
      title: 'Mont Blanc Circuit',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT2BlJfDjwB42Qzs6Funm_DZcVSaSFOB3qnVs6W9BrrI8bUTMRH54qRDj_mHyzKywA4AXgmHKxvCwszmbabqpD24O4H3WLgz9jyPX6BZFruTm4gY7zyzUiSU4RBb0EaHBN3J4tMOG26F5TGKeYZBeS7ieb1x2SjkHCye_e-dMjcabsdzP9nJ2Oq-unYF-ZOh6ICWldJFji4b_etj1PtugzwhKvR3NNeXYaxrSgFXZutUSpKldj0km14asEZ6FA0ol1C7g7fKOFWmxA',
      location: 'Chamonix, France',
      type: 'Hiking',
      comment: 'A classic alpine trek around the Mont Blanc massif.',
      distance: '170 km',
      date: 'Aug 12',
      dificulty: 'Hard',
      time: '10 days',
      rating: 4.8
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
      dificulty: 'Medium',
      time: '4 hrs',
      rating: 4.5
    }
  ]);
}