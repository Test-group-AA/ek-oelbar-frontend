// src/app/components/contact/contact.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ContactService, ContactMessage } from '../../services/contact.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ContactService', ['sendMessage']);

    await TestBed.configureTestingModule({
      imports: [ContactComponent, HttpClientTestingModule, FormsModule],
      providers: [{ provide: ContactService, useValue: spy }]
    }).compileComponents();

    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have empty form initially', () => {
      expect(component.form.name).toBe('');
      expect(component.form.email).toBe('');
      expect(component.form.subject).toBe('');
      expect(component.form.message).toBe('');
    });

    it('should have isSubmitting set to false initially', () => {
      expect(component.isSubmitting).toBeFalse();
    });

    it('should have submitSuccess set to false initially', () => {
      expect(component.submitSuccess).toBeFalse();
    });
  });

  describe('isFormValid method', () => {
    it('should return false when form is empty', () => {
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when name is missing', () => {
      component.form = { name: '', email: 'test@test.dk', subject: '', message: 'Test' };
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when email is missing', () => {
      component.form = { name: 'Test', email: '', subject: '', message: 'Test' };
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return false when message is missing', () => {
      component.form = { name: 'Test', email: 'test@test.dk', subject: '', message: '' };
      expect(component.isFormValid()).toBeFalse();
    });

    it('should return true when required fields are filled', () => {
      component.form = { name: 'Test', email: 'test@test.dk', subject: '', message: 'Test besked' };
      expect(component.isFormValid()).toBeTrue();
    });
  });

  describe('resetForm method', () => {
    it('should reset all form fields', () => {
      component.form = { name: 'Test', email: 'test@test.dk', subject: 'Emne', message: 'Besked' };
      
      component.resetForm();
      
      expect(component.form.name).toBe('');
      expect(component.form.email).toBe('');
      expect(component.form.subject).toBe('');
      expect(component.form.message).toBe('');
    });
  });

  describe('onSubmit method', () => {
    beforeEach(() => {
      component.form = {
        name: 'Test Bruger',
        email: 'test@test.dk',
        subject: 'Test Emne',
        message: 'Dette er en test besked'
      };
    });

    it('should not submit if already submitting', () => {
      component.isSubmitting = true;
      component.onSubmit();
      expect(contactService.sendMessage).not.toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      component.form = { name: '', email: '', subject: '', message: '' };
      component.onSubmit();
      expect(contactService.sendMessage).not.toHaveBeenCalled();
    });

    it('should call contactService.sendMessage with correct data', fakeAsync(() => {
      const mockResponse: ContactMessage = { ...component.form, id: 1 };
      contactService.sendMessage.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(contactService.sendMessage).toHaveBeenCalledWith(jasmine.objectContaining({
        name: 'Test Bruger',
        email: 'test@test.dk',
        subject: 'Test Emne',
        message: 'Dette er en test besked'
      }));
      
      // Flush the 5 second setTimeout from the component
      tick(5000);
    }));

    it('should set submitSuccess to true on success', fakeAsync(() => {
      const mockResponse: ContactMessage = { ...component.form, id: 1 };
      contactService.sendMessage.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.submitSuccess).toBeTrue();
      
      // Flush the 5 second setTimeout from the component
      tick(5000);
    }));

    it('should reset form on success', fakeAsync(() => {
      const mockResponse: ContactMessage = { ...component.form, id: 1 };
      contactService.sendMessage.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();

      expect(component.form.name).toBe('');
      expect(component.form.message).toBe('');
      
      // Flush the 5 second setTimeout from the component
      tick(5000);
    }));

    it('should set submitError on failure', fakeAsync(() => {
      contactService.sendMessage.and.returnValue(throwError(() => new Error('Network error')));

      component.onSubmit();
      tick();

      expect(component.submitError).toBeTruthy();
      expect(component.isSubmitting).toBeFalse();
    }));

    it('should clear submitSuccess after 5 seconds', fakeAsync(() => {
      const mockResponse: ContactMessage = { ...component.form, id: 1 };
      contactService.sendMessage.and.returnValue(of(mockResponse));

      component.onSubmit();
      tick();
      expect(component.submitSuccess).toBeTrue();

      tick(5000);
      expect(component.submitSuccess).toBeFalse();
    }));
  });

  describe('template rendering', () => {
    it('should display contact information', () => {
      const infoCards = fixture.debugElement.queryAll(By.css('.info-card'));
      expect(infoCards.length).toBe(4);
    });

    it('should display phone number', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('+45 33 12 34 56');
    });

    it('should display address', () => {
      const content = fixture.debugElement.nativeElement.textContent;
      expect(content).toContain('Guldbergsgade 29N');
      expect(content).toContain('2200 København N');
    });

    it('should have form fields', () => {
      const nameInput = fixture.debugElement.query(By.css('#name'));
      const emailInput = fixture.debugElement.query(By.css('#email'));
      const subjectInput = fixture.debugElement.query(By.css('#subject'));
      const messageTextarea = fixture.debugElement.query(By.css('#message'));

      expect(nameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(subjectInput).toBeTruthy();
      expect(messageTextarea).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      component.form = { name: '', email: '', subject: '', message: '' };
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.query(By.css('.submit-btn'));
      expect(submitBtn.nativeElement.disabled).toBeTrue();
    });

    it('should show success message when submitSuccess is true', () => {
      component.submitSuccess = true;
      fixture.detectChanges();

      const successMsg = fixture.debugElement.query(By.css('.success-message'));
      expect(successMsg).toBeTruthy();
    });

    it('should show error message when submitError is set', () => {
      component.submitError = 'Der opstod en fejl';
      fixture.detectChanges();

      const errorMsg = fixture.debugElement.query(By.css('.error-message'));
      expect(errorMsg).toBeTruthy();
    });
  });
});