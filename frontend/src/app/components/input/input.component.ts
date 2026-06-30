import {
  Component,
  forwardRef,
  input,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './input.component.html',
})
export class InputComponent implements ControlValueAccessor {
  // Signal Inputs
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  icon = input<string>('');
  errorMessage = input<string>('Invalid input.');
  showForgot = input<boolean>(false);

  control = input<AbstractControl | null>(null);

  // Signals
  value = signal<string>('');
  disabled = signal<boolean>(false);
  isPasswordVisible = signal<boolean>(false);

  onChange = (value: string) => {};
  onTouched = () => {};

  hasError = computed(() => {
    const ctrl = this.control();
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  });

  inputClasses = computed(() => {
    const base =
      'w-full py-3 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none transition-colors shadow-sm shadow-secondary/5';

    const paddingLeft = this.icon() ? 'pl-10' : 'pl-4';
    const paddingRight = this.type() === 'password' || this.hasError() ? 'pr-10' : 'pr-4';

    const stateClasses = this.hasError()
      ? 'border-2 border-error focus:ring-0 focus:border-error'
      : 'border border-outline focus:border-primary focus:ring-1 focus:ring-primary';

    const disabledClasses = this.disabled()
      ? 'opacity-60 cursor-not-allowed bg-surface-container-low'
      : '';

    return `${base} ${paddingLeft} ${paddingRight} ${stateClasses} ${disabledClasses}`;
  });

  // Event Handler
  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  togglePassword() {
    this.isPasswordVisible.update((v) => !v);
  }

  writeValue(value: any): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
