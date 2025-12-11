/**
 * E2E Tests for Events Component
 * 
 * Tests:
 * - Display upcoming events
 * - Event information
 * - Date and time formatting
 * - Event badges
 * - CTA section
 */

describe('Events Component', () => {
  beforeEach(() => {
    cy.visit('/events');
  });

  describe('Page Structure', () => {
    it('should display page header', () => {
      cy.get('.page-header').should('be.visible');
      cy.get('.page-header h1').should('contain.text', 'Events');
      cy.get('.page-header p').should('contain.text', 'live underholdning');
    });

    it('should display CTA section', () => {
      cy.get('.cta-section').should('be.visible');
      cy.get('.cta-section h3').should('contain.text', 'optræde');
      cy.get('.cta-button').should('be.visible');
    });
  });

  describe('API Integration', () => {
    it('should load upcoming events from API', () => {
      cy.intercept('GET', '**/api/events/upcoming').as('getEvents');
      cy.visit('/events');
      cy.wait('@getEvents').its('response.statusCode').should('eq', 200);
    });

    it('should display loading state', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        delay: 1000,
        body: []
      });
      
      cy.visit('/events');
      cy.get('.loading').should('be.visible');
      cy.get('.loading-spinner').should('contain.text', '🎵');
    });
  });

  describe('Event Display', () => {
    it('should display event cards', () => {
      cy.get('.event-card').should('have.length.at.least', 1);
    });

    it('should display event information correctly', () => {
      cy.get('.event-card').first().within(() => {
        // Event date section
        cy.get('.event-date').should('be.visible');
        cy.get('.emoji').should('not.be.empty');
        cy.get('.date').should('not.be.empty');
        
        // Event content
        cy.get('.event-content').should('be.visible');
        cy.get('h3').should('not.be.empty');
        cy.get('.artist').should('not.be.empty');
        cy.get('.description').should('not.be.empty');
        cy.get('.time-badge').should('contain.text', '🕗');
      });
    });

    it('should display Live Jazz Aften event', () => {
      cy.get('.event-card').should('contain.text', 'Live Jazz Aften');
      cy.get('.event-card').should('contain.text', 'Copenhagen Jazz Trio');
    });

    it('should display Trylleshow event', () => {
      cy.get('.event-card').should('contain.text', 'Trylleshow');
      cy.get('.event-card').should('contain.text', 'Magnus');
    });
  });

  describe('Event Badges', () => {
    it('should display "Gratis entre" badge for free events', () => {
      cy.get('.badge.free').should('exist');
      cy.get('.badge.free').should('contain.text', 'Gratis');
    });

    it('should display "Ingen reservation" badge when applicable', () => {
      cy.get('.badge.no-reservation').should('exist');
      cy.get('.badge.no-reservation').should('contain.text', 'reservation');
    });
  });

  describe('Date and Time Formatting', () => {
    it('should format dates in Danish', () => {
      cy.get('.event-card .date').first().invoke('text').then((dateText) => {
        // Check for Danish month names
        const danishMonths = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 
                             'juli', 'august', 'september', 'oktober', 'november', 'december'];
        const hasMonth = danishMonths.some(month => dateText.toLowerCase().includes(month));
        expect(hasMonth).to.be.true;
      });
    });

    it('should display time in HH:MM format', () => {
      cy.get('.time-badge').first().invoke('text').then((timeText) => {
        expect(timeText).to.match(/\d{2}:\d{2}/);
      });
    });

    it('should show both start and end times', () => {
      cy.get('.time-badge').first().should('contain.text', ' - ');
    });
  });

  describe('Event Emojis', () => {
    it('should display emoji for each event', () => {
      cy.get('.event-card').each(($card) => {
        cy.wrap($card).find('.emoji').should('not.be.empty');
      });
    });

    it('should display jazz emoji for jazz event', () => {
      cy.get('.event-card').contains('Jazz').parent().parent().parent()
        .find('.emoji').should('contain.text', '🎷');
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('getEventsError');
      
      cy.visit('/events');
      cy.wait('@getEventsError');
      cy.get('.error').should('be.visible');
      cy.get('.error').should('contain.text', 'Kunne ikke hente');
    });

    it('should allow retry after error', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 500
      }).as('getEventsError');
      
      cy.visit('/events');
      cy.wait('@getEventsError');
      
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 200,
        body: []
      }).as('getEventsRetry');
      
      cy.get('.error button').click();
      cy.wait('@getEventsRetry');
    });

    it('should display message when no events available', () => {
      cy.intercept('GET', '**/api/events/upcoming', {
        statusCode: 200,
        body: []
      }).as('getNoEvents');
      
      cy.visit('/events');
      cy.wait('@getNoEvents');
      cy.get('.no-events').should('be.visible');
      cy.get('.no-events').should('contain.text', 'Ingen kommende events');
    });
  });

  describe('CTA Section', () => {
    it('should have contact link in CTA', () => {
      cy.get('.cta-button').should('have.attr', 'routerLink', '/contact');
      cy.get('.cta-button').should('contain.text', 'Kontakt os');
    });

    it('should navigate to contact page when CTA clicked', () => {
      cy.get('.cta-button').click();
      cy.url().should('include', '/contact');
    });

    it('should describe artist opportunities', () => {
      cy.get('.cta-section').should('contain.text', 'musiker');
      cy.get('.cta-section').should('contain.text', 'poet');
      cy.get('.cta-section').should('contain.text', 'tryllekunstner');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.event-card').should('be.visible');
      cy.get('.event-date').should('be.visible');
    });

    it('should stack event info vertically on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.event-card').first().within(() => {
        cy.get('.event-date').should('be.visible');
        cy.get('.event-content').should('be.visible');
      });
    });

    it('should display correctly on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.events-list').should('be.visible');
      cy.get('.event-card').should('have.length.at.least', 1);
    });
  });

  describe('Event Card Hover Effect', () => {
    it('should have hover effect on event cards', () => {
      cy.get('.event-card').first()
        .should('have.css', 'transition')
        .and('include', 'transform');
    });
  });
});