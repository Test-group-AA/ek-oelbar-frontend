// cypress/support/e2e.ts

// Import commands
import './commands';

// Prevent TypeScript errors on cy commands
/// <reference types="cypress" />

// Global before hook
before(() => {
  cy.log('Starting E2E Test Suite');
});

// Global after hook
after(() => {
  cy.log('E2E Test Suite Completed');
});

// Handle uncaught exceptions (prevents test failures on non-critical errors)
Cypress.on('uncaught:exception', (err) => {
  // Ignore certain errors that don't affect tests
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  // Let other errors fail the test
  return true;
});