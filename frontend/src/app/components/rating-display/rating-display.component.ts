import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-rating-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center text-amber-500" [title]="'Rating: ' + rating() + ' / 5'">
      @for (star of stars(); track $index) {
        <span
          class="material-symbols-outlined text-[18px]"
          [style.font-variation-settings]="star.fontStyle"
        >
          {{ star.icon }}
        </span>
      }
    </div>
  `,
})
export class RatingDisplayComponent {
  rating = input.required<number>();

  stars = computed(() => {
    const r = this.rating();
    const starsArray = [];

    for (let i = 1; i <= 5; i++) {
      if (r >= i) {
        // Full star
        starsArray.push({ icon: 'star', fontStyle: '"FILL" 1' });
      } else if (r > i - 1 && r < i) {
        // Half star
        starsArray.push({ icon: 'star_half', fontStyle: '"FILL" 1' });
      } else {
        // Empty star
        starsArray.push({ icon: 'star', fontStyle: '"FILL" 0' });
      }
    }
    return starsArray;
  });
}
