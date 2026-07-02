import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ApiConfiguration } from '../api/api-configuration';
import { UserResponse } from '../api/models/user-response';
import { UserUpdateRequest } from '../api/models/user-update-request';

import { apiUserMeGet$Json } from '../api/fn/user/api-user-me-get-json';
import { apiUserMePut } from '../api/fn/user/api-user-me-put';
import { apiUserMeDelete } from '../api/fn/user/api-user-me-delete';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfiguration);

  private async hashString(text: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async getCurrentUser(): Promise<UserResponse> {
    const completeResponse = await firstValueFrom(
      apiUserMeGet$Json(this.http, this.apiConfig.rootUrl)
    );

    const response: UserResponse = completeResponse.body;
    return response; 
  }

  async updateUser(updatedData: UserUpdateRequest): Promise<void> {
    if (updatedData.passwordHash) {
      updatedData.passwordHash = await this.hashString(updatedData.passwordHash);
    } 
    await firstValueFrom(
      apiUserMePut(this.http, this.apiConfig.rootUrl, {
        body: updatedData
      })
    );
  }

  async deleteUser(): Promise<void> {
    await firstValueFrom(
      apiUserMeDelete(this.http, this.apiConfig.rootUrl, {
        body: {}
      })
    );
  }
}