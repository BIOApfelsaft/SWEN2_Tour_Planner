import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api/api-configuration';
import { apiWeatherLocationGet$Json } from '../api/fn/weather/api-weather-location-get-json';
import { WeatherResponse } from '../api/models/weather-response';

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfiguration);

  getCurrentWeather(location: string): Observable<WeatherData> {
    return apiWeatherLocationGet$Json(this.http, this.apiConfig.rootUrl, {
      location: location
    }).pipe(
      map(response => {
        const data: WeatherResponse = response.body;
        
        return {
          temperature: Number(data.temperature) || 0,
          condition: data.condition || 'Unknown',
          icon: data.icon || 'device_thermostat'
        };
      })
    );
  }
}