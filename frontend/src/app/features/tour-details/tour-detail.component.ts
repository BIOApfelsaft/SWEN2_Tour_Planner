import { Component, signal, inject, OnInit, effect, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TourLogModalComponent } from '../tour-log-modal/tour-log-modal.component';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [DecimalPipe, TourLogCardComponent, TourMapComponent, WeatherWidgetComponent, ButtonComponent, TourLogModalComponent],
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
  
  isAddingLog = signal<Boolean>(false);
  selectedLogToEdit = signal<TourLog | null>(null);

  isLoading = signal<Boolean>(true);

  constructor() {
    // effect init map when tour data is loaded 
    effect(() => {
      if (!this.isLoading() && this.tour()) {
        setTimeout(() => {
          this.mapFacade.initMap(`leaflet-map-${this.tour()?.id}`);
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

  openCreateModal() {
    this.selectedLogToEdit.set(null);
    this.isAddingLog.set(true);
  }

  handleEditLog(log: TourLog) {
    this.selectedLogToEdit.set(log); 
    this.isAddingLog.set(true);
  }

  closeLogModal() {
    this.isAddingLog.set(false);
    this.selectedLogToEdit.set(null);
  }

  saveLog(logData: any) {
    if (logData.id) {
      // UPDATE: If an ID exists, we update the existing log
      this.tourLogService.updateLog(logData.id, logData).subscribe(updatedLog => {
        if (updatedLog) {
          this.logs.update(currentLogs => 
            currentLogs.map(l => l.id === updatedLog.id ? updatedLog : l)
          );
        }
        this.closeLogModal();
      });
    } else {
      // CREATE: If no ID exists, we create a new log
      this.tourLogService.addLog(logData).subscribe(savedLog => {
        this.logs.update(currentLogs => [savedLog, ...currentLogs]);
        this.closeLogModal();
      });
    }
  }

  handleDeleteLog(log: TourLog) {
    this.tourLogService.deleteLog(log.id).subscribe(() => {
      this.logs.update(currentLogs => currentLogs.filter(l => l.id !== log.id));
    });
  }

  ngOnDestroy(): void {
    this.mapFacade.destroyMap();
  }
}