import { Component, signal, inject, OnInit } from '@angular/core';
import { StatisticCardComponent } from '../../components/statistic-card/statistic-card.component';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { DashboardStatistic } from '../../models/stat.model';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticCardComponent, TourCardComponent],
  templateUrl: './dashboard.component.html' 
})
export class DashboardComponent implements OnInit {
  private tourService = inject(TourService);
  private statsService = inject(StatsService);

  statistics = signal<DashboardStatistic[]>([]);
  plannedTours = signal<Tour[]>([]);
  
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        this.statistics.set(data);
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      }
    });

    this.tourService.getTours().subscribe({
      next: (data) => {
        this.plannedTours.set(data);
      },
      error: (err) => {
        console.error('Failed to load tours', err);
      }
    });
  }
}