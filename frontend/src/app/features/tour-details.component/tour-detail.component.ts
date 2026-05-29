import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../../models/tour.model';
import { TourLog } from '../../models/tour-log.model';
import { DecimalPipe } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { TourLogService } from '../../services/tour-log.service';
import { TourLogCardComponent } from '../../components/tour-log-card.component/tour-log-card.component';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [DecimalPipe, TourLogCardComponent],
  templateUrl: './tour-detail.component.html'
})
export class TourDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);
  private tourLogService = inject(TourLogService);

  tour = signal<Tour | null>(null);
  logs = signal<TourLog[]>([]);

  isLoading = signal<Boolean>(true);

  ngOnInit() {
    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    if (tourId) {
      this.loadTourData(tourId);
    }
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

  handleEditLog(log: TourLog) {
    console.log('Edit log triggered for:', log.id);
  }

  handleDeleteLog(log: TourLog) {
    console.log('Delete log triggered for:', log.id);
  }
}