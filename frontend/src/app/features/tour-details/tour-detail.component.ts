import {
  Component,
  signal,
  inject,
  OnInit,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TourStateService } from '../../services/tour-state.service';
import { TourLogStateService } from '../../services/tour-log-state.service';
import { CreateTourLogRequest } from '../../api/models/create-tour-log-request';
import { TourLogResponse } from '../../api/models/tour-log-response';
import { TourLogCardComponent } from '../../components/tour-log-card/tour-log-card.component';
import { MapFacadeService } from '../../services/map-facade.service';
import { TourMapComponent } from '../../components/tour-map/tour-map.component';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { ButtonComponent } from '../../components/button/button.component';
import { TourLogModalComponent } from '../tour-log-modal/tour-log-modal.component';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    TourLogCardComponent,
    TourMapComponent,
    WeatherWidgetComponent,
    ButtonComponent,
    TourLogModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tour-detail.component.html',
})
export class TourDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mapFacade = inject(MapFacadeService);

  public tourState = inject(TourStateService);
  public tourLogState = inject(TourLogStateService);

  currentTourId = signal<number>(0);

  tour = computed(() => this.tourState.tours().find(t => t.id === this.currentTourId()) || null);
  logs = computed(() => this.tourLogState.logs());

  isAddingLog = signal<Boolean>(false);
  selectedLogToEdit = signal<TourLogResponse | null>(null);

  constructor() {
    // effect init map when tour data is loaded
    effect(() => {
      if (this.tour()) {
        setTimeout(() => {
          this.mapFacade.initMap(`leaflet-map-${this.tour()?.id}`);
        }, 0);
      }
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.currentTourId.set(id);

    if (this.tourState.tours().length === 0) {
      this.tourState.loadTours();
    }

    this.tourLogState.loadLogsForTour(id);
  }

  editTour() {
    if (this.tour()) this.router.navigate(['/tour-planner', this.tour()!.id]);
  }

  deleteTour() {
    const currentTour = this.tour();
    if (currentTour && confirm(`Are you sure you want to delete "${currentTour.title}"?`)) {
      this.tourState.deleteTour(Number(currentTour.id)).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(`Error deleting tour with ID ${currentTour.id}:`, error);
        }
      });
    }
  }

  openCreateModal() {
    this.selectedLogToEdit.set(null);
    this.isAddingLog.set(true);
  }

  handleEditLog(log: TourLogResponse) {
    this.selectedLogToEdit.set(log);
    this.isAddingLog.set(true);
  }

  closeLogModal() {
    this.isAddingLog.set(false);
    this.selectedLogToEdit.set(null);
  }

  saveLog(logData: CreateTourLogRequest & { id?: number }) {
    if (logData.id) {
      this.tourLogState.updateLog(logData.id, logData);
    } else {
      this.tourLogState.addLog(logData);
    }
    this.closeLogModal();
  }

  handleDeleteLog(log: TourLogResponse) {
    this.tourLogState.deleteLog(Number(log.id), Number(log.tourId));
  }

  ngOnDestroy(): void {
    this.mapFacade.destroyMap();
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }
}
