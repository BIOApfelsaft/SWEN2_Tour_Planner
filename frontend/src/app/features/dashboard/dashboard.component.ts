import { Component, computed, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { StatisticCardComponent } from '../../components/statistic-card/statistic-card.component';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { DashboardStatistic } from '../../models/stat.model';
import { TourStateService } from '../../services/tour-state.service';
import { StatsService } from '../../services/stats.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatisticCardComponent, TourCardComponent, SearchBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public tourState = inject(TourStateService);
  private statsService = inject(StatsService);

  statistics = signal<DashboardStatistic[]>([]);
  plannedTours = computed(() => this.tourState.tours());

  ngOnInit(): void {
    if (this.tourState.tours().length === 0) {
      this.tourState.loadTours();
    }

    this.statsService.getDashboardStats().subscribe({
      next: (data) => {
        this.statistics.set(data);
      },
      error: (err) => {
        console.error('Failed to load stats', err);
      },
    });
  }
}