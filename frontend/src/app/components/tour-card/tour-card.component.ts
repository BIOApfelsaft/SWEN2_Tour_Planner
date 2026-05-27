// src/app/components/tour-card/tour-card.component.ts
import { Component, input } from '@angular/core';
import { TourOverview } from '../../models/dashboard.model';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  template: `
    <article class="bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(84,95,114,0.04)] border border-outline-variant overflow-hidden flex flex-col group hover:shadow-[0_4px_16px_rgba(84,95,114,0.08)] transition-all cursor-pointer">
      <div class="h-40 w-full bg-surface-container relative overflow-hidden">
        <img [src]="tour().imageUrl" [alt]="tour().location" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
      </div>
      
      <div class="p-md flex flex-col gap-sm">
        <h4 class="font-title-sm text-title-sm text-on-surface">{{ tour().title }}</h4>
        <div class="flex flex-wrap gap-2 mt-unit">
          <span class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">hiking</span> {{ tour().type }}
          </span>
          <span class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">route</span>
            {{ tour().distance }}
          </span>
          <span class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">calendar_month</span>
            {{ tour().date }}
          </span>
        </div>
      </div>
    </article>
  `,
})
export class TourCardComponent {
  tour = input.required<TourOverview>();
}