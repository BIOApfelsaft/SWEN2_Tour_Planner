import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Mockdata
  getCurrentWeather(location: string): Observable<WeatherData> {
    const temp = 12 + (location.length % 15); // Irgendwas zwischen 12 und 26 Grad
    
    const conditions = ['Clear', 'Partly Cloudy', 'Rain', 'Snow'];
    const icons = ['clear_day', 'partly_cloudy_day', 'rainy', 'ac_unit'];
    const index = location.length % 4;

    const mockResponse: WeatherData = {
      temperature: temp,
      condition: conditions[index],
      icon: icons[index]
    };

    return of(mockResponse).pipe(delay(600));
  }
}