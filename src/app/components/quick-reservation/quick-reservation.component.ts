import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { ValidationService } from '../../services/validation.service';
import { Event } from '../../models/event.model';

export interface ReservationFormErrors {
  customerName: string | null;
  customerEmail: string | null;
  numberOfGuests: string | null;
}

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

  formErrors: ReservationFormErrors = {
    customerName: null,
    customerEmail: null,
    numberOfGuests: null
  };

  constructor(
    private reservationService: ReservationService,
    private validationService: ValidationService
  ) {}

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

  validateForm(): boolean {
    let isValid = true;

    const nameResult = this.validationService.isValidName(this.form.customerName);
    this.formErrors.customerName = nameResult.error || null;
    if (!nameResult.valid) isValid = false;

    const emailResult = this.validationService.isValidEmail(this.form.customerEmail);
    this.formErrors.customerEmail = emailResult.error || null;
    if (!emailResult.valid) isValid = false;

    const guestResult = this.validationService.isValidGuestCount(this.form.numberOfGuests);
    this.formErrors.numberOfGuests = guestResult.error || null;
    if (!guestResult.valid) isValid = false;

    return isValid;
  }

  validateField(field: 'customerName' | 'customerEmail' | 'numberOfGuests'): void {
    switch (field) {
      case 'customerName':
        const nameResult = this.validationService.isValidName(this.form.customerName);
        this.formErrors.customerName = nameResult.error || null;
        break;
      case 'customerEmail':
        const emailResult = this.validationService.isValidEmail(this.form.customerEmail);
        this.formErrors.customerEmail = emailResult.error || null;
        break;
      case 'numberOfGuests':
        const guestResult = this.validationService.isValidGuestCount(this.form.numberOfGuests);
        this.formErrors.numberOfGuests = guestResult.error || null;
        break;
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) return;

    this.submitError = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.reservationService.createReservation({
      eventId: this.event.id!,
      customerName: this.form.customerName.trim(),
      customerEmail: this.form.customerEmail.trim(),
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
    const nameResult = this.validationService.isValidName(this.form.customerName);
    const emailResult = this.validationService.isValidEmail(this.form.customerEmail);
    const guestResult = this.validationService.isValidGuestCount(this.form.numberOfGuests);
    return nameResult.valid && emailResult.valid && guestResult.valid;
  }

  resetForm(): void {
    this.form = {
      customerName: '',
      customerEmail: '',
      numberOfGuests: 1
    };
    this.formErrors = {
      customerName: null,
      customerEmail: null,
      numberOfGuests: null
    };
    this.submitError = '';
  }
}