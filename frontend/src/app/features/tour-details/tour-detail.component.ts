import { Component, signal, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Tour } from '../../models/tour.model';
import { TourLog } from '../../models/tour-log.model';
import { DecimalPipe } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { TourLogService } from '../../services/tour-log.service';
import { TourLogCardComponent } from '../../components/tour-log-card/tour-log-card.component';
import { MapFacadeService } from '../../services/map-facade.service';
import { TourMapComponent } from '../../components/tour-map/tour-map.component';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [DecimalPipe, TourLogCardComponent, TourMapComponent, WeatherWidgetComponent, RouterLink, ButtonComponent],
  templateUrl: './tour-detail.component.html'
})
export class TourDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);
  private mapFacade = inject(MapFacadeService);
  private router = inject(Router);
  tour = signal<Tour | null>(null);
  logs = signal<TourLog[]>([]);

  isLoading = signal<Boolean>(true);

  constructor() {
    // effect init map when tour data is loaded 
    effect(() => {
      if (!this.isLoading() && this.tour()) {
        setTimeout(() => {
          this.mapFacade.initMap('leaflet-map');
          this.mapFacade.drawMockRoute();
        }, 0);
      }
    });
  }

  ngOnInit() {
    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    if (tourId) this.loadTourData(tourId);
  }

  private loadTourData(tourId: number): void {
    this.isLoading.set(true);

    // Fetch the main tour profile
    this.tourService.getTourById(tourId).subscribe({
      next: (tourData) => {
        if (tourData) {
          this.tour.set(tourData);
        }
      },
      error: (err) => console.error('Error loading tour profile', err)
    });

    // Fetch the tracking history logs
    this.tourLogService.getTourLogsForTourId(tourId).subscribe({
      next: (logsData) => {
        this.logs.set(logsData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tour logs', err);
        this.isLoading.set(false);
      }
    });
  }

  editTour() {
    const currentTour = this.tour();
    if (currentTour) {
      this.router.navigate(['/tour-planner', currentTour.id]);
    }
  }

  deleteTour() {
    const currentTour = this.tour();
    if (currentTour) {
      const isConfirmed = confirm(`Are you sure you want to delete the tour "${currentTour.title}"?`);
      
      if (isConfirmed) {
        this.tourService.deleteTour(currentTour.id).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }

  handleEditLog(log: TourLog) {
    console.log('Edit log triggered for:', log.id);
  }

  handleDeleteLog(log: TourLog) {
    console.log('Delete log triggered for:', log.id);
  }


  ngOnDestroy(): void {
    this.mapFacade.destroyMap();
  }
}