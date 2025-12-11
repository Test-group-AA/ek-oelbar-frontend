// src/app/components/weather-widget/weather-widget.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../models/weather.model';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css'
})
export class WeatherWidgetComponent implements OnInit {
  weather: Weather | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    this.isLoading = true;
    this.error = null;

    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        this.weather = data;
        this.isLoading = false;
        if (!data.success) {
          this.error = data.errorMessage || 'Could not load weather';
        }
      },
      error: (err) => {
        this.error = 'Weather service unavailable';
        this.isLoading = false;
      }
    });
  }

  getWeatherEmoji(condition: string): string {
    const map: { [key: string]: string } = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️'
    };
    return map[condition] || '🌤️';
  }
}