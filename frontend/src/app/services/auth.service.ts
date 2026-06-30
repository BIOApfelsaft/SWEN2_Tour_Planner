import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LoginRequest } from '../api/models/login-request';
import { RegisterRequest } from '../api/models/register-request';
import { LoginResponse } from '../api/models/login-response';
import { RegisterResponse } from '../api/models/register-response';

import { apiAuthLoginPost$Json } from '../api/fn/auth/api-auth-login-post-json';
import { apiAuthRegisterPost$Json } from '../api/fn/auth/api-auth-register-post-json';

import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiConfig = inject(ApiConfiguration);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return apiAuthLoginPost$Json(this.http, this.apiConfig.rootUrl, {
      body: credentials
    }).pipe(
      map(response => response.body as LoginResponse),
      tap((response: LoginResponse) => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return apiAuthRegisterPost$Json(this.http, this.apiConfig.rootUrl, {
      body: userData
    }).pipe(
      map(response => response.body as RegisterResponse)
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}