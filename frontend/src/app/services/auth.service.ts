import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TourStateService } from './tour-state.service';
import { TourLogStateService } from './tour-log-state.service';
import { TourCacheService } from './tour-cache.service';
import { MapFacadeService } from './map-facade.service';
import { LayoutService } from './layout.service';

import { RegisterRequest } from '../api/models/register-request';
import { RegisterResponse } from '../api/models/register-response';
import { LoginRequest } from '../api/models/login-request';
import { ChallengeResponse } from '../api/models/challenge-response';
import { LoginResponse } from '../api/models/login-response';

import { apiAuthLoginPost$Json } from '../api/fn/auth/api-auth-login-post-json';
import { apiAuthRegisterPost$Json } from '../api/fn/auth/api-auth-register-post-json';
import { apiAuthChallengeUsernameGet$Json } from '../api/fn/auth/api-auth-challenge-username-get-json';

import { ApiConfiguration } from '../api/api-configuration';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private tourState = inject(TourStateService);
  private tourLogState = inject(TourLogStateService);
  private tourCache = inject(TourCacheService);
  private mapFacade = inject(MapFacadeService);
  private layoutService = inject(LayoutService);
  
  private apiConfig = inject(ApiConfiguration);

  private async hashString(text: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async login(credentials: LoginRequest): Promise<void> {
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required.');
      }

      const fullChallengeResponse = await firstValueFrom(
        apiAuthChallengeUsernameGet$Json(this.http, this.apiConfig.rootUrl, {
          username: credentials.username
        })
      );

      const challengeRes: ChallengeResponse = fullChallengeResponse.body;
      const challenge = challengeRes.challenge;

      if (!challenge) {
        throw new Error('No challenge received from the server.');
      }

      const secret = await this.hashString(credentials.password);
      const responseHash = await this.hashString(secret + challenge);

      const fullLoginResponse = await firstValueFrom(
        apiAuthLoginPost$Json(this.http, this.apiConfig.rootUrl, { 
          body: {
            username: credentials.username,
            password: responseHash
          }
        })
      );

      const loginRes: LoginResponse = fullLoginResponse.body;

      if (loginRes.token) {
        localStorage.setItem('authToken', loginRes.token);
      }
    } catch (error) {
      console.error('Error while logging in:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const fullRegisterResponse = await firstValueFrom(
        apiAuthRegisterPost$Json(this.http, this.apiConfig.rootUrl, {
          body: userData
        })
      );
      
      return fullRegisterResponse.body;
    } catch (error) {
      console.error('Error while registering:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');

    this.tourState.clearState();
    this.tourLogState.clearState();
    this.tourCache.clearCache();
    this.mapFacade.clearState();
    this.layoutService.closeMenu();

    this.router.navigate(['/login']);
  }
}