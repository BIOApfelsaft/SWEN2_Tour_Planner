import { Component, input } from '@angular/core';
import { DashboardStatistic } from '../../models/stat.model';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  template: `
    <div class="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-sm">
      <div class="flex items-center gap-2 text-on-surface-variant">
          <span class="material-symbols-outlined text-[20px]">{{ stat().icon }}</span>
          <span class="font-label-caps text-label-caps">{{ stat().label }}</span>
      </div>
      <div class="font-headline-md text-headline-md text-on-surface">{{ stat().value }}</div>
    </div>
  `,
})
export class StatisticCardComponent {
  stat = input.required<DashboardStatistic>();
}