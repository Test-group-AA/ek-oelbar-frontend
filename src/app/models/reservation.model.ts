// src/app/models/reservation.model.ts
export interface Reservation {
  id?: number;
  event: { id: number; title: string; date: string };
  customerName: string;
  customerEmail: string;
  numberOfGuests: number;
  status: ReservationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface CreateReservationRequest {
  eventId: number;
  customerName: string;
  customerEmail: string;
  numberOfGuests: number;
}