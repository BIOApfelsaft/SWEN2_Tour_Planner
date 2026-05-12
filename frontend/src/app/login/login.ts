import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  apiUrl: string = 'http://localhost:5134/api/auth';

  async register(data: { username: string; email: string; password: string }) {
    console.log('Registrierungsdaten:', data);
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  async login(data: { username: string; password: string }) {
    console.log('Login-Daten:', data);
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }


  // Hilfsmethoden für das HTML
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit() {
    console.log("Submit");
    if (this.loginForm.valid) {
      console.log('Login-Daten:', this.loginForm.value);
      await (await this.register({ username: 'test', email: 'test@test.at', password: 'test123' })).subscribe(response => {
        console.log('Registrierung erfolgreich:', response);
      });
      await (await this.login({ username: 'test', password: 'test123' })).subscribe(response => {
        console.log('Login erfolgreich, Token:', response.token)
        ;
      });
    } else {
      console.log('Formular ungültig');
      this.loginForm.markAllAsTouched();
    }
  }
}