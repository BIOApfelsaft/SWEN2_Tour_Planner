import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <footer
      class="bg-surface-container-low text-on-surface-variant font-body-sm text-xs w-full py-6 mt-auto border-t border-outline-variant"
    >
      <div
        class="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="flex items-center gap-2">
          <span
            class="material-symbols-outlined text-primary text-2xl mr-2"
            style="font-variation-settings: 'FILL' 1;"
            >explore</span
          >
          <span class="font-bold text-primary">Pathfinder</span>
          <span>Pathfinder Tours. For the Professional Explorer.</span>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
