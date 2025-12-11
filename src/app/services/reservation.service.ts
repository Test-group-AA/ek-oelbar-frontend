// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, CreateReservationRequest, ReservationStatus } from '../models/reservation.model';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  getReservationsByEvent(eventId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/event/${eventId}`);
  }

  getAvailableSpots(eventId: number): Observable<{ availableSpots: number }> {
    return this.http.get<{ availableSpots: number }>(`${this.apiUrl}/event/${eventId}/available`);
  }

  getReservationsByStatus(status: ReservationStatus): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/status/${status}`);
  }

  createReservation(request: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, request);
  }

  confirmReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/confirm`, {});
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }
}