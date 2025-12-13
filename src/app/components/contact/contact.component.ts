// src/app/components/contact/contact.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../services/contact.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, WeatherWidgetComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  form: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private contactService: ContactService) {}

  onSubmit(): void {
    if (this.isSubmitting) return;
    if (!this.isFormValid()) return;

    this.isSubmitting = true;
    this.submitError = '';

    const message: ContactMessage = {
      name: this.form.name,
      email: this.form.email,
      subject: this.form.subject,
      message: this.form.message
    };

    this.contactService.sendMessage(message).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.resetForm();
        this.isSubmitting = false;
        setTimeout(() => this.submitSuccess = false, 5000);
      },
      error: (err) => {
        this.submitError = 'Der opstod en fejl. Prøv igen senere.';
        this.isSubmitting = false;
        console.error('Contact form error:', err);
      }
    });
  }

  isFormValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.message);
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}