import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../services/contact.service';
import { ValidationService } from '../../services/validation.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormErrors {
  name: string | null;
  email: string | null;
  message: string | null;
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

  formErrors: FormErrors = {
    name: null,
    email: null,
    message: null
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private contactService: ContactService,
    private validationService: ValidationService
  ) {}

  validateForm(): boolean {
    let isValid = true;
    
    const nameResult = this.validationService.isValidName(this.form.name);
    this.formErrors.name = nameResult.error || null;
    if (!nameResult.valid) isValid = false;
    
    const emailResult = this.validationService.isValidEmail(this.form.email);
    this.formErrors.email = emailResult.error || null;
    if (!emailResult.valid) isValid = false;
    
    const messageResult = this.validationService.isValidMessage(this.form.message);
    this.formErrors.message = messageResult.error || null;
    if (!messageResult.valid) isValid = false;
    
    return isValid;
  }

  validateField(field: 'name' | 'email' | 'message'): void {
    switch (field) {
      case 'name':
        const nameResult = this.validationService.isValidName(this.form.name);
        this.formErrors.name = nameResult.error || null;
        break;
      case 'email':
        const emailResult = this.validationService.isValidEmail(this.form.email);
        this.formErrors.email = emailResult.error || null;
        break;
      case 'message':
        const messageResult = this.validationService.isValidMessage(this.form.message);
        this.formErrors.message = messageResult.error || null;
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

    const message: ContactMessage = {
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      subject: this.form.subject.trim(),
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
    const nameResult = this.validationService.isValidName(this.form.name);
    const emailResult = this.validationService.isValidEmail(this.form.email);
    const messageResult = this.validationService.isValidMessage(this.form.message);
    return nameResult.valid && emailResult.valid && messageResult.valid;
  }

  resetForm(): void {
    this.form = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    this.formErrors = {
      name: null,
      email: null,
      message: null
    };
  }

  getMessageLength(): number {
    return this.form.message?.length || 0;
  }
}