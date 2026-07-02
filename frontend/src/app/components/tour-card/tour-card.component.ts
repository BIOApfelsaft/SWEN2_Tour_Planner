import { Component, input, ChangeDetectionStrategy, effect, inject, OnDestroy } from '@angular/core';
import { TourResponse } from '../../api/models/tour-response';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MapFacadeService } from '../../services/map-facade.service';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      [routerLink]="['/tour', tour().id]"
      class="bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(84,95,114,0.04)] border border-outline-variant overflow-hidden flex flex-col group hover:shadow-[0_4px_16px_rgba(84,95,114,0.08)] transition-all cursor-pointer"
    >
      <div class="h-40 w-full bg-surface-container relative overflow-hidden">
        <div [id]="'leaflet-card-map-' + tour().id" class="w-full h-48 z-0"></div>
      </div>

      <div class="p-md flex flex-col gap-sm">
        <h4 class="font-title-sm text-title-sm text-on-surface">{{ tour().title }}</h4>
        <div class="flex flex-wrap gap-2 mt-unit">
          <span
            class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1"
          >
            <span class="inline-flex items-center gap-2">
              @if (tour().transportType === 'Hiking') {
                <span class="material-symbols-outlined text-[14px]">hiking</span>
              } @else if (tour().transportType === 'MTB') {
                <span class="material-symbols-outlined text-[14px]">directions_bike</span>
              } @else if (tour().transportType === 'Car') {
                <span class="material-symbols-outlined text-[14px]">directions_car</span>
              }
              {{ tour().transportType }}
            </span>
          </span>
          <span
            class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">route</span>
            {{ toNumber(tour().distance) }} km
          </span>
          <span
            class="bg-[#EDF2F7] text-secondary font-label-caps text-label-caps px-2 py-1 rounded-full flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">calendar_month</span>
            {{ toNumber(tour().estimatedTime) / 3600 | number: '1.0-1' }} hours
          </span>
        </div>
      </div>
    </article>
  `,
})
export class TourCardComponent implements OnDestroy {
  tour = input.required<TourResponse>();
  private mapFacade = inject(MapFacadeService);
  private mapId = '';

  constructor() {
    effect(() => {
      const currentTour = this.tour();
      if (currentTour) {
        this.mapId = `leaflet-card-map-${currentTour.id}`;
        
        setTimeout(() => {
          this.mapFacade.initMap(this.mapId);
          
          // Echte Route einzeichnen!
          if (currentTour.routeGeojson) {
             this.mapFacade.drawRoute(this.mapId, currentTour.routeGeojson);
          }
        }, 100);
      }
    });
  }

  ngOnDestroy() {
    if (this.mapId) {
      this.mapFacade.destroyMap(this.mapId); 
    }
  }

    toNumber(value: any): number {
    return Number(value) || 0;
  }
}