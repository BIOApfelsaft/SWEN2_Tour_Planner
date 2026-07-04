import {
  Component,
  input,
  inject,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TourResponse } from '../../api/models/tour-response';
import { MapFacadeService } from '../../services/map-facade.service';

@Component({
  selector: 'app-tour-map',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative w-full rounded-xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container min-h-100"
    >
      <div [id]="mapId" class="absolute inset-0 w-full h-full z-0"></div>

      <img
        [src]="tour().mapImagePath"
        alt="Route Map Visual"
        class="w-full h-full absolute inset-0 object-cover -z-10"
      />

      <div
        class="absolute bottom-4 left-4 right-4 md:right-auto bg-surface/95 backdrop-blur-md border border-outline-variant rounded-xl p-4 shadow-lg flex gap-md items-center z-10 pointer-events-none"
      >
        <div>
          <div class="text-xs text-secondary uppercase tracking-wider font-bold mb-1">Distance</div>
          <div class="font-title-sm text-on-surface">{{ tour().distance }} km</div>
        </div>
        <div class="w-px h-8 bg-outline-variant/50"></div>
        <div>
          <div class="text-xs text-secondary uppercase tracking-wider font-bold mb-1">
            Est. Time
          </div>
          <div class="font-title-sm text-on-surface">
            <!-- Beispiel mit der toNumber Funktion, die du drin hattest: -->
            {{ toNumber(tour().estimatedTime) / 3600 | number: '1.0-1' }} hrs
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TourMapComponent implements OnDestroy {
  tour = input.required<TourResponse>();
  private mapFacade = inject(MapFacadeService);

  readonly mapId = 'tour-map-' + Math.random().toString(36).substring(2, 9);

  constructor() {
    effect(() => {
      const currentTour = this.tour();
      
      if (currentTour) {
        setTimeout(() => {
          this.mapFacade.initMap(this.mapId);
          
          if (currentTour.routeGeojson) {
            this.mapFacade.drawRoute(this.mapId, currentTour.routeGeojson);
          }
        }, 10);
      }
    });
  }

  ngOnDestroy(): void {
    this.mapFacade.destroyMap(this.mapId);
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }
}