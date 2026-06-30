import {
  Component,
  input,
  output,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { TourLog } from '../../models/tour-log.model';
import { RatingDisplayComponent } from '../../components/rating-display/rating-display.component';
import { DifficultyIndicatorComponent } from '../../components/difficulty-display/difficulty-display.component';

export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const startTime = control.get('startTime')?.value;
  const endDate = control.get('endDate')?.value;
  const endTime = control.get('endTime')?.value;

  if (!startDate || !startTime || !endDate || !endTime) return null;

  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  const now = new Date();

  if (start.getTime() > now.getTime() || end.getTime() > now.getTime()) {
    return { futureDateInvalid: true };
  }

  if (end.getTime() <= start.getTime()) {
    return { dateRangeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-tour-log-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    RatingDisplayComponent,
    DifficultyIndicatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './tour-log-modal.component.html',
})
export class TourLogModalComponent implements OnInit {
  // Inputs from Parent
  tourId = input.required<number>();
  defaultDistance = input<number>(0);
  location = input<string>('');

  // Optional log for Edit Mode
  log = input<TourLog | null>(null);

  // Outputs to the Parent
  closeModal = output<void>();
  saveLog = output<any>();

  private fb = inject(FormBuilder);
  private weatherService = inject(WeatherService);

  fetchedWeather: WeatherData | null = null;
  isLoadingWeather = signal<boolean>(false);

  logForm = this.fb.group(
    {
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      startTime: ['08:00', Validators.required],
      endDate: [new Date().toISOString().split('T')[0], Validators.required],
      endTime: ['14:00', Validators.required],
      distance: [0, [Validators.required, Validators.min(0)]],
      difficulty: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: [''],
    },
    { validators: dateRangeValidator },
  );

  ngOnInit() {
    const existingLog = this.log();

    if (existingLog) {
      // Setup Edit Mode
      const startDateObj = new Date(existingLog.logDateTime);
      const endDateObj = new Date(startDateObj.getTime() + existingLog.totalTime * 1000);

      this.logForm.patchValue({
        startDate: startDateObj.toISOString().split('T')[0],
        startTime: startDateObj.toTimeString().substring(0, 5),
        endDate: endDateObj.toISOString().split('T')[0],
        endTime: endDateObj.toTimeString().substring(0, 5),
        distance: existingLog.totalDistance,
        difficulty: existingLog.difficulty,
        rating: existingLog.rating,
        comment: existingLog.comment,
      });

      this.fetchedWeather = {
        temperature: existingLog.temperature || 0,
        condition: existingLog.weatherCondition || 'Unknown',
        icon: 'cloud',
      };
    } else {
      // Setup Create Mode
      this.logForm.patchValue({ distance: this.defaultDistance() });

      if (this.location()) {
        this.isLoadingWeather.set(true);
        this.weatherService.getCurrentWeather(this.location()).subscribe({
          next: (weather) => {
            this.fetchedWeather = weather;
            this.isLoadingWeather.set(false);
          },
          error: (err) => {
            console.error('Weather error', err);
            this.isLoadingWeather.set(false);
          },
        });
      }
    }
  }

  submitForm() {
    if (this.logForm.valid) {
      const formValues = this.logForm.value;
      const existingLog = this.log();

      const start = new Date(`${formValues.startDate}T${formValues.startTime}`);
      const end = new Date(`${formValues.endDate}T${formValues.endTime}`);

      let diffInSeconds = (end.getTime() - start.getTime()) / 1000;

      if (diffInSeconds < 0) diffInSeconds = 0;

      const finalLogData = {
        id: existingLog ? existingLog.id : undefined,
        tourId: this.tourId(),
        logDateTime: start.toISOString(),
        comment: formValues.comment,
        difficulty: Number(formValues.difficulty),
        rating: Number(formValues.rating),
        totalDistance: Number(formValues.distance),
        totalTime: diffInSeconds,
        weatherCondition: this.fetchedWeather?.condition || 'Unknown',
        temperature: this.fetchedWeather?.temperature || 0,
      };

      this.saveLog.emit(finalLogData);
    }
  }
}
