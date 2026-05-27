import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, FooterComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  isLoginMode = true;
  loginForm: FormGroup;
  registerForm: FormGroup;
  
  apiErrorMessage: string | null = null; 

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], 
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordRepeat = control.get('passwordRepeat')?.value;
    if (password && passwordRepeat && password !== passwordRepeat) {
      control.get('passwordRepeat')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  setMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.apiErrorMessage = null; 
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.apiErrorMessage = null;

    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
          next: (res) => {
            localStorage.setItem('authToken', res.token);
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.apiErrorMessage = err.error?.message || err.error || 'Login failed. Please check your credentials.';
            this.cdr.detectChanges();
          }
        });
      } else {
        this.loginForm.markAllAsTouched();
        this.cdr.detectChanges();
      }
    } else {
      if (this.registerForm.valid) {
        const { passwordRepeat, ...registerData } = this.registerForm.value;
        
        this.authService.register(registerData).subscribe({
          next: (res) => {
            this.setMode(true);
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.apiErrorMessage = err.error?.message || err.error || 'Registration failed.';
            this.cdr.detectChanges();
          }
        });
      } else {
        this.registerForm.markAllAsTouched();
        this.cdr.detectChanges();
      }
    }
  }
}