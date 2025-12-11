// cypress/support/commands.ts

/**
 * Custom Cypress commands for EK Ølbar E2E tests
 */

// Visit a page and wait for it to load
Cypress.Commands.add('visitAndWait', (path: string) => {
  cy.visit(path);
  cy.get('app-navbar').should('be.visible');
});

// Wait for API call to complete
Cypress.Commands.add('waitForApi', (alias: string) => {
  cy.wait(alias);
});

// Check if element contains text (case insensitive)
Cypress.Commands.add('containsText', { prevSubject: true }, (subject, text: string) => {
  cy.wrap(subject).should('contain.text', text);
});

// Fill form field
Cypress.Commands.add('fillField', (selector: string, value: string) => {
  cy.get(selector).clear().type(value);
});

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Visit a page and wait for navbar to be visible
       * @example cy.visitAndWait('/beer')
       */
      visitAndWait(path: string): Chainable<void>;
      
      /**
       * Wait for API call to complete
       * @example cy.waitForApi('@getBeers')
       */
      waitForApi(alias: string): Chainable<void>;
      
      /**
       * Check if element contains text (case insensitive)
       * @example cy.get('.title').containsText('Øl')
       */
      containsText(text: string): Chainable<Element>;
      
      /**
       * Fill a form field
       * @example cy.fillField('#name', 'John Doe')
       */
      fillField(selector: string, value: string): Chainable<void>;
    }
  }
}

export {};