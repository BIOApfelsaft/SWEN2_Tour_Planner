import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../models/auth.model';
import { routes } from '../app.routes';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private router = inject(Router);

  // Mock implementation for demonstration
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const mockResponse: LoginResponse = { token: 'mock-jwt-token' };
    return new Observable<LoginResponse>(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }
  
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    const mockResponse: RegisterResponse = { message: 'Registration successful' };
    return new Observable<RegisterResponse>(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }

  logout() {
    localStorage.removeItem('authToken'); 
    this.router.navigate(['/login']);
  }
  /* Backend Implementation
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5134/api/auth';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }*/
}