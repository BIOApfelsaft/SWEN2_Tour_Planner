import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.html',
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() errorMessage: string = 'Invalid input.';
  @Input() showForgot: boolean = false;
  
  @Input() control?: AbstractControl | null; 

  value: string = '';
  disabled: boolean = false;
  isPasswordVisible: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  get hasError(): boolean {
    return !!(this.control && this.control.invalid && this.control.touched);
  }

  get inputClasses(): string {
    const base = 'w-full py-3 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none transition-colors shadow-sm shadow-secondary/5';
    
    const paddingLeft = this.icon ? 'pl-10' : 'pl-4';
    const paddingRight = (this.type === 'password' || this.hasError) ? 'pr-10' : 'pr-4';
    
    const stateClasses = this.hasError 
      ? 'border-2 border-error focus:ring-0 focus:border-error' 
      : 'border border-outline focus:border-primary focus:ring-1 focus:ring-primary';

    return `${base} ${paddingLeft} ${paddingRight} ${stateClasses}`;
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  writeValue(value: any): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}