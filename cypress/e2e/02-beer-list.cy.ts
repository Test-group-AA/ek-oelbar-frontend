/**
 * E2E Tests for Beer List Component
 * 
 * Tests:
 * - Display tap beers
 * - Display bottled beers
 * - Loading states
 * - Error handling
 * - Beer information display
 */

describe('Beer List Component', () => {
  beforeEach(() => {
    cy.visit('/beer');
  });

  describe('Page Structure', () => {
    it('should display page header', () => {
      cy.get('.page-header').should('be.visible');
      cy.get('.page-header h1').should('contain.text', 'Ølkort');
      cy.get('.page-header p').should('contain.text', 'kvalitetsøl');
    });

    it('should display fadøl section', () => {
      cy.get('.beer-section').first().within(() => {
        cy.get('.section-header h2').should('contain.text', 'Fadøl');
        cy.get('.icon').should('contain.text', '🍺');
      });
    });

    it('should display flaskeøl section', () => {
      cy.get('.beer-section').last().within(() => {
        cy.get('.section-header h2').should('contain.text', 'Flaskeøl');
        cy.get('.icon').should('contain.text', '🍾');
      });
    });

    it('should display happy hour banner', () => {
      cy.get('.happy-hour').should('be.visible');
      cy.get('.happy-hour h3').should('contain.text', 'Happy Hour');
      cy.get('.happy-hour').should('contain.text', 'Mandag - Torsdag kl. 16-19');
      cy.get('.happy-hour').should('contain.text', '20% rabat');
    });
  });

  describe('API Integration', () => {
    it('should intercept and load tap beers', () => {
      cy.intercept('GET', '**/api/beers/tap').as('getTapBeers');
      cy.visit('/beer');
      cy.wait('@getTapBeers').its('response.statusCode').should('eq', 200);
    });

    it('should intercept and load bottled beers', () => {
      cy.intercept('GET', '**/api/beers/bottled').as('getBottledBeers');
      cy.visit('/beer');
      cy.wait('@getBottledBeers').its('response.statusCode').should('eq', 200);
    });

    it('should display loading state initially', () => {
      cy.intercept('GET', '**/api/beers/tap', {
        delay: 1000,
        fixture: 'test-data.json'
      });
      
      cy.visit('/beer');
      cy.get('.loading').should('be.visible');
      cy.get('.loading-spinner').should('contain.text', '🍺');
    });
  });

  describe('Beer Display', () => {
    it('should display tap beers with correct information', () => {
      cy.get('.beer-section').first().within(() => {
        cy.get('.beer-card').should('have.length.at.least', 1);
        
        // Check first beer card structure
        cy.get('.beer-card').first().within(() => {
          cy.get('h3').should('not.be.empty');
          cy.get('.price').should('contain.text', 'kr');
          cy.get('.description').should('exist');
        });
      });
    });

    it('should display bottled beers with correct information', () => {
      cy.get('.beer-section').last().within(() => {
        cy.get('.beer-card').should('have.length.at.least', 1);
        
        cy.get('.beer-card').first().within(() => {
          cy.get('h3').should('not.be.empty');
          cy.get('.price').should('contain.text', 'kr');
          cy.get('.description').should('exist');
        });
      });
    });

    it('should display beer metadata when available', () => {
      // Find a beer card with metadata
      cy.get('.beer-card').first().within(() => {
        // Check if country or alcohol percentage is displayed
        cy.get('.beer-meta').should('exist');
      });
    });

    it('should format prices correctly', () => {
      cy.get('.beer-card .price').first().invoke('text').then((price) => {
        expect(price).to.match(/\d+ kr/);
      });
    });
  });

  describe('Beer Categories', () => {
    it('should have both tap and bottled beer sections', () => {
      cy.get('.beer-section').should('have.length', 2);
    });

    it('should display Carlsberg in tap beers', () => {
      cy.get('.beer-section').first().within(() => {
        cy.get('.beer-card').should('contain.text', 'Carlsberg');
      });
    });

    it('should display Corona in bottled beers', () => {
      cy.get('.beer-section').last().within(() => {
        cy.get('.beer-card').should('contain.text', 'Corona');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', () => {
      cy.intercept('GET', '**/api/beers/tap', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getTapBeersError');
      
      cy.visit('/beer');
      cy.wait('@getTapBeersError');
      cy.get('.error').should('be.visible');
      cy.get('.error').should('contain.text', 'Kunne ikke hente');
    });

    it('should allow retry after error', () => {
      // First request fails
      cy.intercept('GET', '**/api/beers/tap', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getTapBeersError');
      
      cy.visit('/beer');
      cy.wait('@getTapBeersError');
      
      // Setup successful retry
      cy.intercept('GET', '**/api/beers/tap', {
        statusCode: 200,
        body: []
      }).as('getTapBeersRetry');
      
      cy.get('.error button').click();
      cy.wait('@getTapBeersRetry');
      cy.get('.error').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.beer-grid').should('be.visible');
      cy.get('.beer-card').first().should('be.visible');
    });

    it('should display correctly on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.beer-grid').should('be.visible');
      cy.get('.beer-card').should('have.length.at.least', 1);
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.beer-grid').should('be.visible');
    });
  });

  describe('Student Discounts', () => {
    it('should display student discount information', () => {
      cy.get('.happy-hour').should('contain.text', 'studiekort');
      cy.get('.happy-hour').should('contain.text', 'fremvises');
    });

    it('should display Friday special offer', () => {
      cy.get('.happy-hour').should('contain.text', 'Fredag');
      cy.get('.happy-hour').should('contain.text', '2 for 1');
    });
  });
});