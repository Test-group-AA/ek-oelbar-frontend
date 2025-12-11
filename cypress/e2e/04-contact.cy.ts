/**
 * E2E Tests for Contact Component
 * 
 * Tests:
 * - Contact form submission
 * - Form validation
 * - Success/error messages
 * - Contact information display
 */

describe('Contact Component', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  describe('Page Structure', () => {
    it('should display page header', () => {
      cy.get('.page-header').should('be.visible');
      cy.get('.page-header h1').should('contain.text', 'Kontakt');
    });

    it('should display contact information', () => {
      cy.get('.contact-info').should('be.visible');
      cy.get('.info-card').should('have.length', 4);
    });

    it('should display all contact info cards', () => {
      cy.get('.contact-info').within(() => {
        cy.contains('Telefon').should('exist');
        cy.contains('E-mail').should('exist');
        cy.contains('Adresse').should('exist');
        cy.contains('Åbningstider').should('exist');
      });
    });

    it('should display map section', () => {
      cy.get('.map-section').should('be.visible');
      cy.get('.map-placeholder').should('be.visible');
      cy.get('.map-info a').should('have.attr', 'href').and('include', 'google.com/maps');
    });

    it('should display contact form', () => {
      cy.get('.contact-form-section').should('be.visible');
      cy.get('form').should('be.visible');
    });
  });

  describe('Contact Information', () => {
    it('should display phone number', () => {
      cy.get('.contact-info').should('contain.text', '+45 33 12 34 56');
    });

    it('should display email address', () => {
      cy.get('.contact-info').should('contain.text', 'info@ekbeerbar.dk');
    });

    it('should display full address', () => {
      cy.get('.contact-info').should('contain.text', 'Guldbergsgade 29N');
      cy.get('.contact-info').should('contain.text', '2200 København N');
    });

    it('should display opening hours', () => {
      cy.get('.contact-info').should('contain.text', 'Man - Tor');
      cy.get('.contact-info').should('contain.text', '15:00 - 01:00');
    });

    it('should have Google Maps link', () => {
      cy.get('.map-info a')
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
    });
  });

  describe('Contact Form - Valid Submission', () => {
    beforeEach(() => {
      cy.fixture('test-data.json').as('testData');
    });

    it('should submit form with valid data', function() {
      const { name, email, subject, message } = this.testData.contactMessages.validMessage;
      
      cy.intercept('POST', '**/api/contact', {
        statusCode: 201,
        body: { id: 1, name, email, subject, message }
      }).as('submitContact');

      // Fill form
      cy.get('#name').type(name);
      cy.get('#email').type(email);
      cy.get('#subject').type(subject);
      cy.get('#message').type(message);

      // Submit
      cy.get('.submit-btn').click();
      cy.wait('@submitContact');

      // Check success message
      cy.get('.success-message').should('be.visible');
      cy.get('.success-message').should('contain.text', 'Tak for din besked');
    });

    it('should clear form after successful submission', function() {
      const { name, email, subject, message } = this.testData.contactMessages.validMessage;
      
      cy.intercept('POST', '**/api/contact', {
        statusCode: 201,
        body: { id: 1 }
      }).as('submitContact');

      cy.get('#name').type(name);
      cy.get('#email').type(email);
      cy.get('#subject').type(subject);
      cy.get('#message').type(message);
      cy.get('.submit-btn').click();
      cy.wait('@submitContact');

      // Form should be cleared
      cy.get('#name').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#subject').should('have.value', '');
      cy.get('#message').should('have.value', '');
    });

    it('should hide success message after 5 seconds', function() {
      const { name, email, subject, message } = this.testData.contactMessages.validMessage;
      
      cy.intercept('POST', '**/api/contact', {
        statusCode: 201,
        body: { id: 1 }
      }).as('submitContact');

      cy.get('#name').type(name);
      cy.get('#email').type(email);
      cy.get('#subject').type(subject);
      cy.get('#message').type(message);
      cy.get('.submit-btn').click();
      cy.wait('@submitContact');

      cy.get('.success-message').should('be.visible');
      cy.wait(5000);
      cy.get('.success-message').should('not.exist');
    });
  });

  describe('Contact Form - Validation', () => {
    it('should disable submit button when form is empty', () => {
      cy.get('.submit-btn').should('be.disabled');
    });

    it('should require name field', () => {
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      cy.get('.submit-btn').should('be.disabled');
    });

    it('should require email field', () => {
      cy.get('#name').type('Test User');
      cy.get('#message').type('Test message');
      cy.get('.submit-btn').should('be.disabled');
    });

    it('should require message field', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('.submit-btn').should('be.disabled');
    });

    it('should enable submit button when required fields are filled', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      cy.get('.submit-btn').should('not.be.disabled');
    });

    it('should allow optional subject field to be empty', () => {
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      // Subject is left empty
      cy.get('.submit-btn').should('not.be.disabled');
    });
  });

  describe('Contact Form - Error Handling', () => {
    it('should display error message on submission failure', () => {
      cy.intercept('POST', '**/api/contact', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('submitContactError');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      cy.get('.submit-btn').click();
      cy.wait('@submitContactError');

      cy.get('.error-message').should('be.visible');
      cy.get('.error-message').should('contain.text', 'fejl');
    });

    it('should not clear form on submission error', () => {
      cy.intercept('POST', '**/api/contact', {
        statusCode: 500
      }).as('submitContactError');

      const name = 'Test User';
      const email = 'test@example.com';
      const message = 'Test message';

      cy.get('#name').type(name);
      cy.get('#email').type(email);
      cy.get('#message').type(message);
      cy.get('.submit-btn').click();
      cy.wait('@submitContactError');

      // Form should retain values
      cy.get('#name').should('have.value', name);
      cy.get('#email').should('have.value', email);
      cy.get('#message').should('have.value', message);
    });
  });

  describe('Contact Form - Submit Button States', () => {
    it('should show loading state during submission', () => {
      cy.intercept('POST', '**/api/contact', {
        delay: 1000,
        statusCode: 201,
        body: { id: 1 }
      }).as('submitContact');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      cy.get('.submit-btn').click();

      // Button should show loading text
      cy.get('.submit-btn').should('contain.text', 'Sender');
      cy.get('.submit-btn').should('be.disabled');

      cy.wait('@submitContact');
      cy.get('.submit-btn').should('contain.text', 'Send besked');
    });

    it('should prevent double submission', () => {
      cy.intercept('POST', '**/api/contact', {
        delay: 1000,
        statusCode: 201,
        body: { id: 1 }
      }).as('submitContact');

      cy.get('#name').type('Test User');
      cy.get('#email').type('test@example.com');
      cy.get('#message').type('Test message');
      
      cy.get('.submit-btn').click();
      cy.get('.submit-btn').click(); // Try to click again
      
      // Should only make one request
      cy.get('@submitContact.all').should('have.length', 1);
    });
  });

  describe('Responsive Design', () => {
    it('should stack contact info on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.contact-grid').should('exist');
      cy.get('.contact-info').should('be.visible');
    });

    it('should stack form fields on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.form-row').should('exist');
      cy.get('#name').should('be.visible');
      cy.get('#email').should('be.visible');
    });
  });

  describe('Transport Information', () => {
    it('should display transport options', () => {
      cy.get('.transport-info').should('be.visible');
      cy.get('.transport-info').should('contain.text', 'Metro');
      cy.get('.transport-info').should('contain.text', 'Bus');
      cy.get('.transport-info').should('contain.text', 'Cykel');
    });
  });
});