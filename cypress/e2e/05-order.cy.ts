/**
 * E2E Tests for Order Component
 * 
 * Tests:
 * - Create order with age verification
 * - Add beers to order
 * - Order status transitions
 * - Discount calculations
 * - Order summary
 */

describe('Order Component', () => {
  beforeEach(() => {
    cy.visit('/order');
  });

  describe('Page Structure', () => {
    it('should display page header', () => {
      cy.get('.page-header').should('be.visible');
      cy.get('.page-header h1').should('contain.text', 'Order');
    });

    it('should show order creation form initially', () => {
      cy.get('.card h2').should('contain.text', 'Start New Order');
      cy.get('#age').should('be.visible');
      cy.get('#student').should('be.visible');
    });
  });

  describe('Order Creation - Valid Age', () => {
    it('should create order with valid age', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          customerAge: 25,
          hasStudentCard: false,
          status: 'CREATED',
          totalPrice: 0,
          discountPercent: 0,
          finalPrice: 0
        }
      }).as('createOrder');

      cy.get('#age').clear().type('25');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrder');

      // Order section should appear
      cy.get('.order-header').should('be.visible');
      cy.get('.status-badge').should('contain.text', 'CREATED');
    });

    it('should create order with student card', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 2,
          customerAge: 22,
          hasStudentCard: true,
          status: 'CREATED',
          totalPrice: 0,
          discountPercent: 0,
          finalPrice: 0
        }
      }).as('createOrder');

      cy.get('#age').clear().type('22');
      cy.get('#student').check();
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrder');

      cy.get('.order-header').should('exist');
    });

    it('should create order with minimum age (18)', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: { id: 3, customerAge: 18, status: 'CREATED', totalPrice: 0, finalPrice: 0 }
      }).as('createOrder');

      cy.get('#age').clear().type('18');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrder');

      cy.get('.status-badge').should('exist');
    });
  });

  describe('Order Creation - Age Validation', () => {
    it('should reject underage customer (17)', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 400,
        body: { error: 'Invalid customer age' }
      }).as('createOrderFail');

      cy.get('#age').clear().type('17');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrderFail');

      cy.get('.message.error').should('be.visible');
    });

    it('should reject age above maximum (121)', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 400,
        body: { error: 'Invalid customer age' }
      }).as('createOrderFail');

      cy.get('#age').clear().type('121');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrderFail');

      cy.get('.message.error').should('be.visible');
    });
  });

  describe('Add Beer to Order', () => {
    beforeEach(() => {
      // Create order first
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          customerAge: 25,
          hasStudentCard: false,
          status: 'CREATED',
          totalPrice: 0,
          discountPercent: 0,
          finalPrice: 0
        }
      }).as('createOrder');

      cy.intercept('GET', '**/api/beers', {
        statusCode: 200,
        body: [
          { id: 1, name: 'Carlsberg Pilsner', price: 45 },
          { id: 2, name: 'Tuborg Classic', price: 45 }
        ]
      }).as('getBeers');

      cy.get('#age').clear().type('25');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrder');
    });

    it('should add beer to order', () => {
      cy.intercept('POST', '**/api/orders/1/items', {
        statusCode: 200,
        body: {
          id: 1,
          status: 'CREATED',
          totalPrice: 90,
          discountPercent: 0,
          finalPrice: 90
        }
      }).as('addBeer');

      cy.intercept('GET', '**/api/orders/1/lines', {
        statusCode: 200,
        body: [
          {
            id: 1,
            beer: { id: 1, name: 'Carlsberg Pilsner', price: 45 },
            quantity: 2,
            unitPrice: 45,
            lineTotal: 90
          }
        ]
      }).as('getOrderLines');

      cy.get('select').select('1');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button').contains('Add').click();
      cy.wait('@addBeer');

      cy.get('.message.success').should('be.visible');
    });

    it('should display order lines after adding beer', () => {
      cy.intercept('POST', '**/api/orders/1/items').as('addBeer');
      cy.intercept('GET', '**/api/orders/1/lines', {
        statusCode: 200,
        body: [
          {
            beer: { name: 'Carlsberg Pilsner', price: 45 },
            quantity: 2,
            lineTotal: 90
          }
        ]
      }).as('getOrderLines');

      cy.get('select').select('1');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button').contains('Add').click();
      cy.wait('@addBeer');

      // Force load order lines
      cy.reload();
      cy.get('.line-item').should('exist');
    });

    it('should update order total after adding beer', () => {
      cy.intercept('POST', '**/api/orders/1/items', {
        statusCode: 200,
        body: {
          id: 1,
          totalPrice: 90,
          finalPrice: 90
        }
      }).as('addBeer');

      cy.get('select').select('1');
      cy.get('input[type="number"]').clear().type('2');
      cy.get('button').contains('Add').click();
      cy.wait('@addBeer');

      cy.get('.summary-row.total').should('contain.text', '90');
    });
  });

  describe('Order Status Transitions', () => {
    beforeEach(() => {
      // Setup order in CREATED state
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          status: 'CREATED',
          totalPrice: 90,
          finalPrice: 90
        }
      });

      cy.get('#age').clear().type('25');
      cy.get('button').contains('Start Order').click();
    });

    it('should confirm order (CREATED → CONFIRMED)', () => {
      cy.intercept('PUT', '**/api/orders/1/confirm', {
        statusCode: 200,
        body: { id: 1, status: 'CONFIRMED', totalPrice: 90, finalPrice: 90 }
      }).as('confirmOrder');

      cy.get('button').contains('Confirm Order').click();
      cy.wait('@confirmOrder');

      cy.get('.status-badge').should('contain.text', 'CONFIRMED');
    });

    it('should pay order (CONFIRMED → PAID)', () => {
      // First confirm
      cy.intercept('PUT', '**/api/orders/1/confirm', {
        statusCode: 200,
        body: { id: 1, status: 'CONFIRMED' }
      });
      cy.get('button').contains('Confirm Order').click();

      // Then pay
      cy.intercept('PUT', '**/api/orders/1/pay', {
        statusCode: 200,
        body: { id: 1, status: 'PAID' }
      }).as('payOrder');

      cy.get('button').contains('Pay Now').click();
      cy.wait('@payOrder');

      cy.get('.status-badge').should('contain.text', 'PAID');
    });

    it('should cancel order from CREATED state', () => {
      cy.intercept('PUT', '**/api/orders/1/cancel', {
        statusCode: 200,
        body: { id: 1, status: 'CANCELLED' }
      }).as('cancelOrder');

      cy.get('button').contains('Cancel Order').click();
      cy.wait('@cancelOrder');

      cy.get('.status-badge').should('contain.text', 'CANCELLED');
    });
  });

  describe('Discount Calculations', () => {
    it('should display student discount', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          customerAge: 22,
          hasStudentCard: true,
          status: 'CREATED',
          totalPrice: 100,
          discountPercent: 10,
          finalPrice: 90
        }
      });

      cy.get('#age').clear().type('22');
      cy.get('#student').check();
      cy.get('button').contains('Start Order').click();

      cy.intercept('POST', '**/api/orders/1/items', {
        statusCode: 200,
        body: {
          totalPrice: 100,
          discountPercent: 10,
          finalPrice: 90
        }
      });

      // After adding items, discount should be visible
      cy.get('.summary-row.discount').should('contain.text', '10%');
    });

    it('should not exceed maximum discount (35%)', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          totalPrice: 100,
          discountPercent: 35,
          finalPrice: 65
        }
      });

      cy.get('#age').clear().type('22');
      cy.get('#student').check();
      cy.get('button').contains('Start Order').click();

      // Max discount is 35%
      cy.get('.summary-row').contains('35%').should('exist');
    });
  });

  describe('Order Summary', () => {
    beforeEach(() => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 201,
        body: {
          id: 1,
          status: 'CREATED',
          totalPrice: 90,
          discountPercent: 10,
          finalPrice: 81
        }
      });

      cy.get('#age').clear().type('22');
      cy.get('#student').check();
      cy.get('button').contains('Start Order').click();
    });

    it('should display subtotal', () => {
      cy.get('.summary-row').contains('Subtotal').should('exist');
    });

    it('should display discount when applicable', () => {
      cy.get('.summary-row.discount').should('contain.text', '10%');
    });

    it('should display final total', () => {
      cy.get('.summary-row.total').should('contain.text', 'Total');
    });
  });

  describe('Status Badge Styling', () => {
    it('should show correct color for CREATED status', () => {
      cy.intercept('POST', '**/api/orders', {
        body: { id: 1, status: 'CREATED', totalPrice: 0, finalPrice: 0 }
      });

      cy.get('#age').clear().type('25');
      cy.get('button').contains('Start Order').click();

      cy.get('.status-badge').should('have.class', 'status-created');
    });
  });

  describe('Error Messages', () => {
    it('should display error on order creation failure', () => {
      cy.intercept('POST', '**/api/orders', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('createOrderError');

      cy.get('#age').clear().type('25');
      cy.get('button').contains('Start Order').click();
      cy.wait('@createOrderError');

      cy.get('.message.error').should('be.visible');
    });
  });
});