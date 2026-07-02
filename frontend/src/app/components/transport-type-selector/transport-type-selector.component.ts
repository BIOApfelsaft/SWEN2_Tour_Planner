import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-transport-type-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-surface-container rounded-lg p-xs flex gap-xs border border-outline-variant/30">
      <button
        type="button"
        (click)="select('Hiking')"
        class="flex-1 py-2 flex items-center justify-center rounded-md transition-all"
        [class]="
          selected() === 'Hiking'
            ? 'bg-surface-container-lowest shadow-sm text-primary'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        "
      >
        <span class="material-symbols-outlined text-[20px]">directions_walk</span>
      </button>

      <button
        type="button"
        (click)="select('MTB')"
        class="flex-1 py-2 flex items-center justify-center rounded-md transition-all"
        [class]="
          selected() === 'MTB'
            ? 'bg-surface-container-lowest shadow-sm text-primary'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        "
      >
        <span class="material-symbols-outlined text-[20px]">pedal_bike</span>
      </button>

      <button
        type="button"
        (click)="select('Car')"
        class="flex-1 py-2 flex items-center justify-center rounded-md transition-all"
        [class]="
          selected() === 'Car'
            ? 'bg-surface-container-lowest shadow-sm text-primary'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        "
      >
        <span class="material-symbols-outlined text-[20px]">directions_car</span>
      </button>
    </div>
  `,
})
export class TransportTypeSelectorComponent {
  selected = input.required<string>();
  selectionChange = output<string>();

  select(type: string) {
    this.selectionChange.emit(type);
  }
}
