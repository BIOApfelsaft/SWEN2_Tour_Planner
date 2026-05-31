import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TourLogService } from '../../services/tour-log.service';
import { User } from '../../models/user.model';
import { ButtonComponent } from '../../components/button/button.component';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, InputComponent, ButtonComponent],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private tourLogService = inject(TourLogService);
  private fb = inject(FormBuilder);

  user = signal<User | null>(null);
  
  totalDistance = signal<number>(0);
  totalLogs = signal<number>(0);
  totalTime = signal<number>(0);
  isSaving = signal<boolean>(false);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['********']
  });

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(u => {
      this.user.set(u);
      this.profileForm.patchValue({
        name: u.name,
        email: u.email
      });
    });

    this.tourLogService.getAllLogsForUserId(1).subscribe(logs => {
      this.totalLogs.set(logs.length);
      const distance = logs.reduce((sum, log) => sum + log.totalDistance, 0);
      this.totalDistance.set(distance);
      const time = logs.reduce((sum, log) => sum + log.totalTime, 0) / 3600; // convert s to hours
      this.totalTime.set(time);
    });
  }

  saveProfile() {
    if (this.profileForm.valid && this.user()) {
      this.isSaving.set(true);
      const updatedData = {
        name: this.profileForm.value.name!,
        email: this.profileForm.value.email!
      };

      this.userService.updateUser(updatedData).subscribe(updatedUser => {
        this.user.set(updatedUser);
        this.isSaving.set(false);
        this.profileForm.patchValue({ password: '********' });
      });
    }
  }
}