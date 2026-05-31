import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TourLogService } from '../../services/tour-log.service';
import { TourService } from '../../services/tour.service';
import { TourLog } from '../../models/tour-log.model';
import { Tour } from '../../models/tour.model';
import { RatingDisplayComponent } from '../../components/rating-display/rating-display.component';
import { DifficultyIndicatorComponent } from '../../components/difficulty-display/difficulty-display.component';
import { TourLogModalComponent } from '../tour-log-modal/tour-log-modal.component';

export interface EnrichedTourLog extends TourLog {
  tourTitle: string;
  tourLocation: string;
  transportType: string;
}

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RatingDisplayComponent, DifficultyIndicatorComponent, TourLogModalComponent],
  templateUrl: './activity-log.component.html'
})
export class ActivityLogComponent implements OnInit {
  private tourLogService = inject(TourLogService);
  private tourService = inject(TourService);

  private rawLogs = signal<TourLog[]>([]);
  private tours = signal<Tour[]>([]);

  isEditModalOpen = signal<boolean>(false);
  selectedLogToEdit = signal<TourLog | null>(null);
  selectedTourForEdit = signal<Tour | null>(null);

  enrichedLogs = computed<EnrichedTourLog[]>(() => {
    const allTours = this.tours();
    return this.rawLogs().map(log => {
      const tour = allTours.find(t => t.id === log.tourId);
      return {
        ...log,
        tourTitle: tour?.title || 'Unknown Tour',
        tourLocation: tour?.startLocation || 'Unknown Location',
        transportType: tour?.transportType || 'Hiking'
      };
    });
  });

  ngOnInit() {
    this.tourService.getTours().subscribe(tours => {
      this.tours.set(tours);
      
      this.tourLogService.getAllLogsForUserId(1).subscribe(logs => {
        this.rawLogs.set(logs);
      });
    });
  }

  getIconForTransport(type: string): string {
    if (type === 'MTB') return 'pedal_bike';
    if (type === 'Car') return 'directions_car';
    return 'directions_walk';
  }

  editLog(log: EnrichedTourLog) {
    const tour = this.tours().find(t => t.id === log.tourId);
    if (tour) {
      this.selectedTourForEdit.set(tour);
      this.selectedLogToEdit.set(log as TourLog);
      this.isEditModalOpen.set(true);
    }
  }

  deleteLog(logId: number) {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.tourLogService.deleteLog(logId).subscribe(() => {
        this.rawLogs.update(logs => logs.filter(l => l.id !== logId));
      });
    }
  }

  saveUpdatedLog(updatedLogData: any) {
    this.tourLogService.updateLog(updatedLogData.id, updatedLogData).subscribe(savedLog => {
      if (savedLog) {
        this.rawLogs.update(logs => logs.map(l => l.id === savedLog.id ? savedLog : l));
      }
      this.isEditModalOpen.set(false);
    });
  }
}