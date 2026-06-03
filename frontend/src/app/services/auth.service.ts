import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
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