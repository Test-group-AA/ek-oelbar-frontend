/**
 * E2E Tests for Navigation and Routing
 * 
 * Tests:
 * - Navigation between pages
 * - URL changes
 * - Active link highlighting
 * - Mobile menu functionality
 * - Page loads correctly
 */

describe('Navigation and Routing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Desktop Navigation', () => {
    it('should display the navbar with logo and links', () => {
      cy.get('.navbar').should('be.visible');
      cy.get('.logo-title').should('contain.text', 'EK Ølbar');
      cy.get('.nav-desktop').should('be.visible');
      cy.get('.nav-desktop .nav-link').should('have.length', 4);
    });

    it('should navigate to all main pages', () => {
      // Navigate to Ølkort
      cy.get('.nav-desktop').contains('Ølkort').click();
      cy.url().should('include', '/beer');
      cy.get('.page-header h1').should('contain.text', 'Ølkort');

      // Navigate to Events
      cy.get('.nav-desktop').contains('Events').click();
      cy.url().should('include', '/events');
      cy.get('.page-header h1').should('contain.text', 'Events');

      // Navigate to Kontakt
      cy.get('.nav-desktop').contains('Kontakt').click();
      cy.url().should('include', '/contact');
      cy.get('.page-header h1').should('contain.text', 'Kontakt');

      // Navigate back to Hjem
      cy.get('.nav-desktop').contains('Hjem').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('.hero-content h1').should('contain.text', 'EK Ølbar');
    });

    it('should highlight active navigation link', () => {
      // Check home is active initially
      cy.get('.nav-desktop a[routerLink="/"]').should('have.class', 'active');

      // Navigate to beer page
      cy.get('.nav-desktop').contains('Ølkort').click();
      cy.get('.nav-desktop a[routerLink="/beer"]').should('have.class', 'active');
      cy.get('.nav-desktop a[routerLink="/"]').should('not.have.class', 'active');
    });

    it('should navigate using logo click', () => {
      cy.visit('/beer');
      cy.get('.logo').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
    });

    it('should toggle mobile menu', () => {
      // Menu should be hidden initially
      cy.get('.nav-mobile').should('not.exist');

      // Click hamburger to open
      cy.get('.mobile-toggle').click();
      cy.get('.nav-mobile').should('be.visible');

      // Click X to close
      cy.get('.mobile-toggle').click();
      cy.get('.nav-mobile').should('not.exist');
    });

    it('should navigate using mobile menu', () => {
      // Open mobile menu
      cy.get('.mobile-toggle').click();
      cy.get('.nav-mobile').should('be.visible');

      // Click on Events
      cy.get('.nav-mobile').contains('Events').click();
      cy.url().should('include', '/events');

      // Menu should close after navigation
      cy.get('.nav-mobile').should('not.exist');
    });
  });

  describe('Footer Navigation', () => {
    it('should display footer with links', () => {
      cy.get('.footer').should('be.visible');
      cy.get('.footer-links a').should('have.length', 4);
      cy.get('.footer').should('contain.text', new Date().getFullYear());
    });

    it('should navigate using footer links', () => {
      cy.get('.footer-links').contains('Ølkort').click();
      cy.url().should('include', '/beer');
    });
  });

  describe('Direct URL Access', () => {
    it('should load beer page directly', () => {
      cy.visit('/beer');
      cy.get('.page-header h1').should('contain.text', 'Ølkort');
    });

    it('should load events page directly', () => {
      cy.visit('/events');
      cy.get('.page-header h1').should('contain.text', 'Events');
    });

    it('should redirect invalid routes to home', () => {
      cy.visit('/invalid-route', { failOnStatusCode: false });
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Hero Section Actions', () => {
    it('should navigate from hero buttons', () => {
      // Click "Se vores øl" button
      cy.get('.hero-buttons').contains('Se vores øl').click();
      cy.url().should('include', '/beer');

      // Go back home
      cy.visit('/');

      // Click "Kommende events" button
      cy.get('.hero-buttons').contains('Kommende events').click();
      cy.url().should('include', '/events');
    });
  });
});