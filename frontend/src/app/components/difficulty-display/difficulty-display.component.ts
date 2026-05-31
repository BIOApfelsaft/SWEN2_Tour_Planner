import { Component, input, computed } from '@angular/core';

interface DifficultyLevel {
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-difficulty-indicator',
  standalone: true,
  template: `
    <div [class]="levelInfo().colorClass" 
         class="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold shadow-sm"
         [title]="'Difficulty: ' + levelInfo().label + ' (' + level() + '/5)'">
      <span class="material-symbols-outlined text-[16px]">{{ levelInfo().icon }}</span>
      <span>{{ levelInfo().label }}</span>
    </div>
  `
})
export class DifficultyIndicatorComponent {
  level = input.required<number>();

  private levels: Record<number, DifficultyLevel> = {
    1: { label: 'Easy', icon: 'filter_1', colorClass: 'bg-emerald-100 text-emerald-900' },
    2: { label: 'Moderate', icon: 'filter_2', colorClass: 'bg-sky-100 text-sky-900' },
    3: { label: 'Challenging', icon: 'filter_3', colorClass: 'bg-amber-100 text-amber-900' },
    4: { label: 'Hard', icon: 'filter_4', colorClass: 'bg-orange-100 text-orange-900' },
    5: { label: 'Extreme', icon: 'filter_5', colorClass: 'bg-red-100 text-red-900' }
  };

  levelInfo = computed(() => {
    const l = this.level();
    return this.levels[l] || { label: 'Unknown', icon: 'help', colorClass: 'bg-surface-container text-on-surface' };
  });
}