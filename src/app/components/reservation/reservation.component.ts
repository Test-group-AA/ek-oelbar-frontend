// src/app/components/reservation/reservation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { EventService } from '../../services/event.service';
import { Reservation, ReservationStatus } from '../../models/reservation.model';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  events: Event[] = [];
  reservations: Reservation[] = [];
  
  selectedEventId: number | null = null;
  customerName: string = '';
  customerEmail: string = '';
  numberOfGuests: number = 1;
  availableSpots: number = 0;
  
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private reservationService: ReservationService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadReservations();
  }

  loadEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => this.events = events,
      error: () => this.error = 'Could not load events'
    });
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (res) => this.reservations = res
    });
  }

  onEventChange(): void {
    if (this.selectedEventId) {
      this.reservationService.getAvailableSpots(this.selectedEventId).subscribe({
        next: (res) => this.availableSpots = res.availableSpots
      });
    }
  }

  createReservation(): void {
    if (!this.selectedEventId || !this.customerName || !this.customerEmail) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.reservationService.createReservation({
      eventId: this.selectedEventId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      numberOfGuests: this.numberOfGuests
    }).subscribe({
      next: () => {
        this.success = 'Reservation created!';
        this.resetForm();
        this.loadReservations();
        this.onEventChange();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error || 'Could not create reservation';
        this.isLoading = false;
      }
    });
  }

  confirmReservation(id: number): void {
    this.reservationService.confirmReservation(id).subscribe({
      next: () => {
        this.success = 'Reservation confirmed!';
        this.loadReservations();
      },
      error: (err) => this.error = err.error || 'Could not confirm'
    });
  }

  cancelReservation(id: number): void {
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.success = 'Reservation cancelled';
        this.loadReservations();
        this.onEventChange();
      },
      error: (err) => this.error = err.error || 'Could not cancel'
    });
  }

  resetForm(): void {
    this.customerName = '';
    this.customerEmail = '';
    this.numberOfGuests = 1;
  }

  getStatusClass(status: ReservationStatus): string {
    const classes: { [key: string]: string } = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'CANCELLED': 'status-cancelled'
    };
    return classes[status] || '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('da-DK', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}