// src/app/components/quick-reservation/quick-reservation.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-quick-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-reservation.component.html',
  styleUrl: './quick-reservation.component.css'
})
export class QuickReservationComponent {
  @Input() event!: Event;
  @Output() success = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  showForm = false;
  isSubmitting = false;
  submitError = '';
  submitSuccess = false;
  availableSpots = 0;

  form = {
    customerName: '',
    customerEmail: '',
    numberOfGuests: 1
  };

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadAvailableSpots();
  }

  openForm(): void {
    this.showForm = true;
    this.loadAvailableSpots();
  }

  closeForm(): void {
    this.showForm = false;
    this.resetForm();
    this.cancel.emit();
  }

  loadAvailableSpots(): void {
    if (this.event && this.event.id) {
      this.reservationService.getAvailableSpots(this.event.id).subscribe({
        next: (response) => {
          this.availableSpots = response.availableSpots;
        },
        error: () => {
          this.availableSpots = 0;
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.reservationService.createReservation({
      eventId: this.event.id!,
      customerName: this.form.customerName,
      customerEmail: this.form.customerEmail,
      numberOfGuests: this.form.numberOfGuests
    }).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.isSubmitting = false;
        
        setTimeout(() => {
          this.success.emit();
          this.closeForm();
          this.submitSuccess = false;
        }, 2000);
      },
      error: (err) => {
        this.submitError = err.error || 'Kunne ikke oprette reservation. Prøv igen.';
        this.isSubmitting = false;
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.form.customerName.trim() &&
      this.form.customerEmail.trim() &&
      this.form.numberOfGuests >= 1 &&
      this.form.numberOfGuests <= 20
    );
  }

  resetForm(): void {
    this.form = {
      customerName: '',
      customerEmail: '',
      numberOfGuests: 1
    };
    this.submitError = '';
  }
}