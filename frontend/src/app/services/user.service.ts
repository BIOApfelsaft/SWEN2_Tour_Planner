import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Mockdata
  private mockUser: User = {
    id: 1,
    name: 'Alex Harrison',
    email: 'alex.harrison@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  };

  getCurrentUser(): Observable<User> {
    return of({ ...this.mockUser }).pipe(delay(200));
  }

  updateUser(updatedData: Partial<User>): Observable<User> {
    this.mockUser = { ...this.mockUser, ...updatedData };
    return of({ ...this.mockUser }).pipe(delay(400));
  }
}