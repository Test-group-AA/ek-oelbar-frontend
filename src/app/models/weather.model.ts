export interface Weather {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  success: boolean;
  errorMessage?: string;
}