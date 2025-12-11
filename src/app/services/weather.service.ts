// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Weather } from '../models/weather.model';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `${environment.apiUrl}/api/weather`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(): Observable<Weather> {
    return this.http.get<Weather>(this.apiUrl);
  }

  getWeatherByCity(city: string): Observable<Weather> {
    return this.http.get<Weather>(`${this.apiUrl}/${city}`);
  }
}