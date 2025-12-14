import { Injectable } from '@angular/core';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  isValidAge(age: number | null | undefined): ValidationResult {
    if (age === null || age === undefined) {
      return { valid: false, error: 'Alder er påkrævet' };
    }
    if (!Number.isInteger(age)) {
      return { valid: false, error: 'Alder skal være et heltal' };
    }
    if (age < 18) {
      return { valid: false, error: 'Du skal være mindst 18 år' };
    }
    if (age > 120) {
      return { valid: false, error: 'Ugyldig alder (max 120)' };
    }
    return { valid: true };
  }

  isValidEmail(email: string | null | undefined): ValidationResult {
    if (!email || email.trim() === '') {
      return { valid: false, error: 'Email er påkrævet' };
    }
    
    const trimmed = email.trim();
    
    if (trimmed !== email || email.includes(' ')) {
      return { valid: false, error: 'Email må ikke indeholde mellemrum' };
    }
    
    const atCount = (email.match(/@/g) || []).length;
    if (atCount !== 1) {
      return { valid: false, error: 'Email skal indeholde præcis ét @' };
    }
    
    const atIndex = email.indexOf('@');
    
    if (atIndex === 0) {
      return { valid: false, error: 'Email skal have tekst før @' };
    }
    
    const domain = email.substring(atIndex + 1);
    
    if (!domain.includes('.')) {
      return { valid: false, error: 'Email-domæne skal indeholde et punktum' };
    }
    
    if (domain.startsWith('.') || domain.endsWith('.')) {
      return { valid: false, error: 'Ugyldigt email-domæne' };
    }
    
    return { valid: true };
  }

  isValidMessage(message: string | null | undefined): ValidationResult {
    if (message === null || message === undefined) {
      return { valid: false, error: 'Besked er påkrævet' };
    }
    if (message.trim() === '') {
      return { valid: false, error: 'Besked må ikke være tom' };
    }
    if (message.length > 2000) {
      return { valid: false, error: `Besked er for lang (${message.length}/2000 tegn)` };
    }
    return { valid: true };
  }

  isValidName(name: string | null | undefined): ValidationResult {
    if (name === null || name === undefined) {
      return { valid: false, error: 'Navn er påkrævet' };
    }
    if (name.trim() === '') {
      return { valid: false, error: 'Navn må ikke være tomt' };
    }
    if (name.length > 100) {
      return { valid: false, error: 'Navn er for langt (max 100 tegn)' };
    }
    const nameRegex = /^[a-zA-ZæøåÆØÅàáâãäçèéêëìíîïñòóôõöùúûüýÿ\s'\-]+$/;
    if (!nameRegex.test(name)) {
      return { valid: false, error: 'Navn må kun indeholde bogstaver' };
    }
    return { valid: true };
  }

  isValidGuestCount(guests: number | null | undefined): ValidationResult {
    if (guests === null || guests === undefined) {
      return { valid: false, error: 'Antal gæster er påkrævet' };
    }
    if (!Number.isInteger(guests)) {
      return { valid: false, error: 'Antal gæster skal være et heltal' };
    }
    if (guests < 1) {
      return { valid: false, error: 'Mindst 1 gæst påkrævet' };
    }
    if (guests > 20) {
      return { valid: false, error: 'Max 20 gæster per reservation' };
    }
    return { valid: true };
  }

  isValidQuantity(quantity: number | null | undefined): ValidationResult {
    if (quantity === null || quantity === undefined) {
      return { valid: false, error: 'Antal er påkrævet' };
    }
    if (!Number.isInteger(quantity)) {
      return { valid: false, error: 'Antal skal være et heltal' };
    }
    if (quantity < 1) {
      return { valid: false, error: 'Mindst 1 stk påkrævet' };
    }
    if (quantity > 10) {
      return { valid: false, error: 'Max 10 stk per ordre' };
    }
    return { valid: true };
  }
}