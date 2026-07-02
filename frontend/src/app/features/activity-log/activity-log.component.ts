import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { TourResponse } from '../../api/models/tour-response';
import { TourLogResponse } from '../../api/models/tour-log-response';
import { CreateTourLogRequest } from '../../api/models/create-tour-log-request';

import { TourLogStateService } from '../../services/tour-log-state.service';
import { TourStateService } from '../../services/tour-state.service';
import { RatingDisplayComponent } from '../../components/rating-display/rating-display.component';
import { DifficultyIndicatorComponent } from '../../components/difficulty-display/difficulty-display.component';
import { TourLogModalComponent } from '../tour-log-modal/tour-log-modal.component';

export interface EnrichedTourLog extends TourLogResponse {
  tourTitle: string;
  tourLocation: string;
  transportType: string;
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    RatingDisplayComponent,
    DifficultyIndicatorComponent,
    TourLogModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './activity-log.component.html',
})
export class ActivityLogComponent implements OnInit {
  public tourLogState = inject(TourLogStateService); 
  public tourState = inject(TourStateService);

  isEditModalOpen = signal<boolean>(false);
  selectedLogToEdit = signal<TourLogResponse | null>(null);
  selectedTourForEdit = signal<TourResponse | null>(null);

  enrichedLogs = computed<EnrichedTourLog[]>(() => {
    const allTours = this.tourState.tours(); 
    
    return this.tourLogState.logs().map((log) => {
      const tour = allTours.find((t) => t.id === log.tourId);
      return {
        ...log,
        tourTitle: tour?.title || 'Unknown Tour',
        tourLocation: tour?.startLocation || 'Unknown Location',
        transportType: tour?.transportType || 'Hiking',
      };
    });
  });

  ngOnInit() {
    if (this.tourState.tours().length === 0) {
      this.tourState.loadTours();
    }

    this.tourLogState.loadMyLogs();
  }

  getIconForTransport(type: string): string {
    if (type === 'MTB') return 'pedal_bike';
    if (type === 'Car') return 'directions_car';
    return 'directions_walk';
  }

  editLog(log: EnrichedTourLog) {
    const tour = this.tourState.tours().find((t) => t.id === log.tourId);
    if (tour) {
      this.selectedTourForEdit.set(tour);
      this.selectedLogToEdit.set(log as TourLogResponse);
      this.isEditModalOpen.set(true);
    }
  }

  deleteLog(log: EnrichedTourLog) {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.tourLogState.deleteLog(log.id as number, log.tourId as number);
    }
  }

  saveUpdatedLog(updatedLogData: CreateTourLogRequest & { id?: number }) {
    if (updatedLogData.id) {
      this.tourLogState.updateLog(updatedLogData.id, updatedLogData);
    }

    this.isEditModalOpen.set(false);
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }
}