/**
 * E2E Tests for Reservation Component
 * 
 * Tests:
 * - Create reservation
 * - Event selection
 * - Available spots calculation
 * - Reservation status transitions
 * - Form validation
 */

describe('Reservation Component', () => {
  beforeEach(() => {
    cy.visit('/reservations');
  });

  describe('Page Structure', () => {
    it('should display page header', () => {
      cy.get('.page-header').should('be.visible');
      cy.get('.page-header h1').should('contain.text', 'Reservation');
    });

    it('should display reservation form', () => {
      cy.get('.card h2').contains('Make a Reservation').should('exist');
      cy.get('#event').should('be.visible');
      cy.get('#name').should('be.visible');
      cy.get('#email').should('be.visible');
      cy.get('#guests').should('be.visible');
    });

    it('should display reservations list', () => {
      cy.get('.card h2').contains('Your Reservations').should('exist');
      cy.get('.reservations-list, .no-reservations').should('exist');
    });
  });

  describe('Load Events', () => {
    it('should load events into dropdown', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 200,
        body: [
          {
            id: 1,
            title: 'Live Jazz Aften',
            date: '2026-01-08',
            emoji: '🎷'
          },
          {
            id: 2,
            title: 'Trylleshow',
            date: '2026-01-15',
            emoji: '🎩'
          }
        ]
      }).as('getEvents');

      cy.visit('/reservations');
      cy.wait('@getEvents');

      cy.get('#event option').should('have.length.at.least', 2);
      cy.get('#event').should('contain.text', 'Live Jazz Aften');
    });
  });

  describe('Available Spots', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 200,
        body: [
          { id: 1, title: 'Live Jazz Aften', date: '2026-01-08', emoji: '🎷' }
        ]
      });
    });

    it('should display available spots when event is selected', () => {
      cy.intercept('GET', '**/api/reservations/event/1/available', {
        statusCode: 200,
        body: { availableSpots: 196 }
      }).as('getAvailableSpots');

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.wait('@getAvailableSpots');

      cy.get('.available-spots').should('be.visible');
      cy.get('.spots-count').should('contain.text', '196');
    });

    it('should update available spots on event change', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [
          { id: 1, title: 'Event 1', date: '2026-01-08', emoji: '🎷' },
          { id: 2, title: 'Event 2', date: '2026-01-15', emoji: '🎩' }
        ]
      });

      cy.intercept('GET', '**/api/reservations/event/1/available', {
        body: { availableSpots: 196 }
      }).as('getSpots1');

      cy.intercept('GET', '**/api/reservations/event/2/available', {
        body: { availableSpots: 198 }
      }).as('getSpots2');

      cy.visit('/reservations');
      
      cy.get('#event').select('1');
      cy.wait('@getSpots1');
      cy.get('.spots-count').should('contain.text', '196');

      cy.get('#event').select('2');
      cy.wait('@getSpots2');
      cy.get('.spots-count').should('contain.text', '198');
    });
  });

  describe('Create Reservation - Valid Data', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Live Jazz Aften', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('GET', '**/api/reservations/event/1/available', {
        body: { availableSpots: 196 }
      });
    });

    it('should create reservation with valid data', () => {
      cy.intercept('POST', '**/api/reservations', {
        statusCode: 201,
        body: {
          id: 1,
          event: { id: 1, title: 'Live Jazz Aften', date: '2026-01-08' },
          customerName: 'Cypress Test',
          customerEmail: 'cypress@test.com',
          numberOfGuests: 4,
          status: 'PENDING'
        }
      }).as('createReservation');

      cy.intercept('GET', '**/api/reservations', {
        body: []
      });

      cy.visit('/reservations');
      
      cy.get('#event').select('1');
      cy.get('#name').type('Cypress Test');
      cy.get('#email').type('cypress@test.com');
      cy.get('#guests').clear().type('4');
      cy.get('button').contains('Make Reservation').click();
      
      cy.wait('@createReservation');
      cy.get('.message.success').should('be.visible');
    });

    it('should clear form after successful reservation', () => {
      cy.intercept('POST', '**/api/reservations', {
        statusCode: 201,
        body: { id: 1, status: 'PENDING' }
      }).as('createReservation');

      cy.intercept('GET', '**/api/reservations', { body: [] });

      cy.visit('/reservations');
      
      cy.get('#event').select('1');
      cy.get('#name').type('Test User');
      cy.get('#email').type('test@test.com');
      cy.get('#guests').clear().type('3');
      cy.get('button').contains('Make Reservation').click();
      
      cy.wait('@createReservation');

      // Form should be reset (except event selection)
      cy.get('#name').should('have.value', '');
      cy.get('#email').should('have.value', '');
      cy.get('#guests').should('have.value', '1');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });
    });

    it('should require event selection', () => {
      cy.visit('/reservations');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('button').contains('Make Reservation').should('be.disabled');
    });

    it('should require name', () => {
      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#email').type('test@test.com');
      cy.get('button').contains('Make Reservation').should('be.disabled');
    });

    it('should require email', () => {
      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('button').contains('Make Reservation').should('be.disabled');
    });

    it('should enable submit when all required fields are filled', () => {
      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('button').contains('Make Reservation').should('not.be.disabled');
    });

    it('should reject invalid guest count', () => {
      cy.intercept('POST', '**/api/reservations', {
        statusCode: 400,
        body: { error: 'Invalid guest count' }
      }).as('createReservationFail');

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('#guests').clear().type('25');
      cy.get('button').contains('Make Reservation').click();
      
      cy.wait('@createReservationFail');
      cy.get('.message.error').should('be.visible');
    });
  });

  describe('Guest Count Boundaries', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });
    });

    it('should accept minimum guests (1)', () => {
      cy.intercept('POST', '**/api/reservations', {
        statusCode: 201,
        body: { id: 1, numberOfGuests: 1, status: 'PENDING' }
      });

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('#guests').should('have.attr', 'min', '1');
    });

    it('should accept maximum guests (20)', () => {
      cy.intercept('POST', '**/api/reservations', {
        statusCode: 201,
        body: { id: 1, numberOfGuests: 20, status: 'PENDING' }
      });

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('#guests').should('have.attr', 'max', '20');
    });
  });

  describe('Reservation Status Transitions', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { id: 1, title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 4,
            status: 'PENDING'
          }
        ]
      });
    });

    it('should confirm pending reservation', () => {
      cy.intercept('PUT', '**/api/reservations/1/confirm', {
        statusCode: 200,
        body: { id: 1, status: 'CONFIRMED' }
      }).as('confirmReservation');

      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 4,
            status: 'CONFIRMED'
          }
        ]
      });

      cy.visit('/reservations');
      cy.get('.btn-confirm').click();
      cy.wait('@confirmReservation');

      cy.get('.message.success').should('be.visible');
    });

    it('should cancel reservation', () => {
      cy.intercept('PUT', '**/api/reservations/1/cancel', {
        statusCode: 200,
        body: { id: 1, status: 'CANCELLED' }
      }).as('cancelReservation');

      cy.visit('/reservations');
      cy.get('.btn-cancel').click();
      cy.wait('@cancelReservation');

      cy.get('.message.success').should('be.visible');
    });
  });

  describe('Reservations List', () => {
    it('should display existing reservations', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { id: 1, title: 'Jazz Event', date: '2026-01-08' },
            customerName: 'John Doe',
            numberOfGuests: 3,
            status: 'CONFIRMED'
          }
        ]
      });

      cy.visit('/reservations');
      
      cy.get('.reservation-item').should('have.length', 1);
      cy.get('.res-event').should('contain.text', 'Jazz Event');
      cy.get('.reservation-item').should('contain.text', 'John Doe');
      cy.get('.reservation-item').should('contain.text', '3 guests');
    });

    it('should display "no reservations" message when list is empty', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('GET', '**/api/reservations', {
        body: []
      });

      cy.visit('/reservations');
      cy.get('.no-reservations').should('be.visible');
      cy.get('.no-reservations').should('contain.text', 'No reservations yet');
    });

    it('should not show action buttons for cancelled reservations', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 2,
            status: 'CANCELLED'
          }
        ]
      });

      cy.visit('/reservations');
      cy.get('.res-actions').should('not.exist');
    });
  });

  describe('Status Badge Colors', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });
    });

    it('should display yellow badge for PENDING status', () => {
      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 2,
            status: 'PENDING'
          }
        ]
      });

      cy.visit('/reservations');
      cy.get('.status-badge').should('have.class', 'status-pending');
    });

    it('should display green badge for CONFIRMED status', () => {
      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 2,
            status: 'CONFIRMED'
          }
        ]
      });

      cy.visit('/reservations');
      cy.get('.status-badge').should('have.class', 'status-confirmed');
    });

    it('should display red badge for CANCELLED status', () => {
      cy.intercept('GET', '**/api/reservations', {
        body: [
          {
            id: 1,
            event: { title: 'Event', date: '2026-01-08' },
            customerName: 'Test',
            numberOfGuests: 2,
            status: 'CANCELLED'
          }
        ]
      });

      cy.visit('/reservations');
      cy.get('.status-badge').should('have.class', 'status-cancelled');
    });
  });

  describe('Error Handling', () => {
    it('should display error on reservation creation failure', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('POST', '**/api/reservations', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('createReservationError');

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('button').contains('Make Reservation').click();
      
      cy.wait('@createReservationError');
      cy.get('.message.error').should('be.visible');
    });

    it('should handle insufficient capacity', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        body: [{ id: 1, title: 'Event', date: '2026-01-08', emoji: '🎷' }]
      });

      cy.intercept('POST', '**/api/reservations', {
        statusCode: 409,
        body: { error: 'Not enough spots available' }
      }).as('createReservationConflict');

      cy.visit('/reservations');
      cy.get('#event').select('1');
      cy.get('#name').type('Test');
      cy.get('#email').type('test@test.com');
      cy.get('#guests').clear().type('15');
      cy.get('button').contains('Make Reservation').click();
      
      cy.wait('@createReservationConflict');
      cy.get('.message.error').should('be.visible');
    });
  });
});