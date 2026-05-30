import { Component, input, signal, inject, effect } from '@angular/core';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  template: `
    @if (weather(); as w) {
      <span class="flex items-center text-primary bg-primary-container/30 px-2 py-1 rounded text-body-sm font-bold shadow-sm">
        <span class="material-symbols-outlined text-[18px] mr-1">{{ w.icon }}</span> 
        {{ w.temperature }}°C, {{ w.condition }}
      </span>
    } @else {
      <span class="w-24 h-6 bg-surface-container rounded animate-pulse block"></span>
    }
  `
})
export class WeatherWidgetComponent {
  location = input.required<string>();
  
  private weatherService = inject(WeatherService);
  weather = signal<WeatherData | null>(null);

  constructor() {
    effect(() => {
      const loc = this.location();
      if (loc) {
        this.weather.set(null);
        this.weatherService.getCurrentWeather(loc).subscribe({
          next: (data) => this.weather.set(data),
          error: (err) => console.error('Error loading weather', err)
        });
      }
    });
  }
}