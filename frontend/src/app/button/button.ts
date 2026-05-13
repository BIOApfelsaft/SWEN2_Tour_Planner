import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() trailingIcon?: string;
  @Input() disabled: boolean = false;

  get combinedClasses() {
    const base = 'w-full font-title-sm text-title-sm py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2';
    
    if (this.variant === 'primary') {
      return `${base} bg-primary hover:bg-surface-tint text-on-primary shadow-[0_4px_16px_rgba(84,95,114,0.08)] ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
    } else {
      return `${base} bg-surface border border-outline text-on-surface hover:bg-surface-container-low`;
    }
  }
}