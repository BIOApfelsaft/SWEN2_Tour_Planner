import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TourLogStateService } from '../../services/tour-log-state.service';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';
import { UserResponse } from '../../api/models/user-response';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  public tourLogState = inject(TourLogStateService); 
  private fb = inject(FormBuilder);

  user = signal<UserResponse | null>(null);

  totalLogs = computed(() => this.tourLogState.logs().length);
  
  totalDistance = computed(() => 
    this.tourLogState.logs().reduce((sum, log) => sum + Number(log.totalDistance), 0)
  );
  
  totalTime = computed(() => 
    this.tourLogState.logs().reduce((sum, log) => sum + Number(log.totalTime), 0) / 3600
  );

  isSaving = signal<boolean>(false);
  apiErrorMessage = signal<string | null>(null);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['********', Validators.required],
  });

  ngOnInit() {
    this.loadProfileData();
  };

  private async loadProfileData() {
    this.tourLogState.loadMyLogs();
    
    try {
      const currentUser = await this.userService.getCurrentUser();
      this.user.set(currentUser);
      
      this.profileForm.patchValue({
        name: currentUser.username,
        email: currentUser.email,
      });

      if (currentUser.id == null) {
        throw new Error('Current user ID is missing');
      }
    } catch (error) {
      console.error('Failed to load user profile', error);
      this.apiErrorMessage.set('Konnte Profil nicht laden.');
    }
  }

  onDeleteAccount() {
    const confirmed = confirm('Are you sure you want to permanently delete your account? This cannot be undone.');
    
    if (!confirmed) return;

    this.isSaving.set(true);

    this.userService.deleteUser()
      .then(() => {
        alert('Your account has been deleted.');
        window.location.href = '/login'; 
      })
      .catch((error) => {
        console.error('Failed to delete account', error);
        this.apiErrorMessage.set('Failed to delete account.');
      })
      .finally(() => {
        this.isSaving.set(false);
      });
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.apiErrorMessage.set(null);

    if (this.profileForm.value.password === '********') {
      this.profileForm.patchValue({ password: null });
    } else if (this.profileForm.value.password && this.profileForm.value.password.length < 6) {
      this.apiErrorMessage.set('The password must be at least 6 characters long.');
      this.isSaving.set(false);
      return;
    }

    const updatedData = {
      username: this.profileForm.value.name!,
      email: this.profileForm.value.email!,
      passwordHash: this.profileForm.value.password!,
    };

    try {
      await this.userService.updateUser(updatedData);
      
      await this.loadProfileData(); 
    } catch (error: any) {
      this.apiErrorMessage.set(error.error?.message || 'Error saving profile.');
    } finally {
      this.isSaving.set(false);
      this.profileForm.patchValue({ password: '********' });
    }
  }
}
