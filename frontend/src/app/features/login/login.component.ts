import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, FooterComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoginMode = signal<boolean>(true);
  apiErrorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    username: ['', [Validators.required]], 
    password: ['', [Validators.required]]
  });

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordRepeat: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordRepeat = control.get('passwordRepeat')?.value;
    
    if (password && passwordRepeat && password !== passwordRepeat) {
      control.get('passwordRepeat')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  setMode(isLogin: boolean): void {
    this.isLoginMode.set(isLogin);
    this.apiErrorMessage.set(null);
  }

  onSubmit(): void {
    this.apiErrorMessage.set(null);

    if (this.isLoginMode()) {
      this.handleLogin();
    } else {
      this.handleRegistration();
    }
  }

  private handleLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const loginData = this.loginForm.value as { username: string; password: string };
    this.authService.login(loginData).subscribe({
      next: (res) => {
        localStorage.setItem('authToken', res.token);
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.apiErrorMessage.set(err.error?.message || err.error || 'Login failed. Please check your credentials.');
        this.isLoading.set(false);
      }
    });
  }

  private handleRegistration(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { passwordRepeat, ...registerData } = this.registerForm.value as { username: string; email: string; password: string; passwordRepeat: string };
    
    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.setMode(true); // Switch to login mode upon successful registration
      },
      error: (err) => {
        this.apiErrorMessage.set(err.error?.message || err.error || 'Registration failed.');
        this.isLoading.set(false);
      }
    });
  }
}