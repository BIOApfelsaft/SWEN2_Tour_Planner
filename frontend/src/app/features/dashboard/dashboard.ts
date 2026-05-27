// src/app/features/dashboard/dashboard.component.ts
import { Component, signal } from '@angular/core';
import { StatisticCardComponent } from '../../components/statistic-card/statistic-card.component';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { DashboardStatistic, TourOverview } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticCardComponent, TourCardComponent],
  template: `
    <div class="flex-1 p-margin pb-24 md:pb-margin flex flex-col gap-xl">
      
      <section class="w-full max-w-4xl">
        <div class="relative w-full shadow-sm rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <span class="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input class="w-full bg-transparent border-none py-4 pl-12 pr-4 font-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-0" placeholder="Search tours, logs, or locations..." type="text"/>
        </div>
      </section>

      <section class="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        @for (stat of statistics(); track stat.label) {
          <app-statistic-card [stat]="stat" />
        }
      </section>

      <section class="flex flex-col gap-md">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-md text-headline-md text-on-surface">Planned Tours</h3>
          <div class="flex gap-2">
            <button class="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">
              <span class="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[20px]">list</span>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          @for (tour of plannedTours(); track tour.id) {
            <app-tour-card [tour]="tour" />
          }
        </div>
      </section>
    </div>
  `
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
      distance: '170 km',
      date: 'Aug 12',
      isBookmarked: true
    },
    {
      id: '2',
      title: 'Slickrock Trail Expedition',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ghgfyUx5wuwa7dB57-678faKyJwuIeK_CI-jdL-Z2ruZfcBdvAWTmRa9NyjNOb9rohMcBXQF0WgC-aXMKfjNpouZQLI4kVob9ow9LzYffxXnwQLjVkKd2ygqHW3WZTLGmGTexWvMDvgS-1A0nSs9dF1G9XpQkBgiKoRIXNHkQHTs-0z_2wSiOignqaTcRc0gGhgA3asiIsLUTJfvDZqmRSzf-Tn1P6mHtPB85m5yq-KfQ8Oi7EvXKSXGd9Zdokso6wbF71rtQTrx',
      location: 'Moab, Utah',
      type: 'MTB',
      distance: '17 km',
      date: 'Sep 04',
      isBookmarked: false
    }
  ]);
}