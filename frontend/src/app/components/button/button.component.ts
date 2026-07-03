import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <button
    [type]="type()"
    [class]="combinedClasses()"
    [disabled]="disabled()"
    [attr.aria-label]="ariaLabel()"
  >
    @if (label()) {
      {{ label() }}
    } @else {
      <ng-content></ng-content>
    }

    @if (trailingIcon()) {
      <span class="material-symbols-outlined text-[20px]">{{ trailingIcon() }}</span>
    }
  </button>`,
})
export class ButtonComponent {
  // Signal Inputs
  label = input<string>('');
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary' | 'error'>('primary');
  trailingIcon = input<string>();
  disabled = input<boolean>(false);

  // Computed Signal for class
  combinedClasses = computed(() => {
    const base =
      'w-full font-title-sm text-title-sm py-3 px-5 rounded-lg transition-colors flex justify-center items-center gap-2';

    if (this.variant() === 'primary') {
      return `${base} bg-primary hover:bg-surface-tint text-on-primary shadow-[0_4px_16px_rgba(84,95,114,0.08)] ${this.disabled() ? 'opacity-50 cursor-not-allowed' : ''}`;
    } else if (this.variant() === 'error') {
      return `${base} bg-error hover:bg-error-hover text-on-error shadow-[0_4px_16px_rgba(84,95,114,0.08)] ${this.disabled() ? 'opacity-50 cursor-not-allowed' : ''}`;
    } else {
      return `${base} bg-secondary border border-outline text-on-secondary hover:bg-on-secondary-container`;
    }
  });

  ariaLabel = computed(() => {
    const lbl = this.label();
    return lbl ? lbl : this.trailingIcon() ? `Button with icon ${this.trailingIcon()}` : 'button';
  });
}
