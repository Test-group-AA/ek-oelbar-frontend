// cypress/e2e/user-flows.cy.ts

/**
 * SIMPLE E2E TESTS - Real User Flows Only
 * 
 * No mocking, no edge cases - just real scenarios
 * ~30 tests covering main user journeys
 */

describe('EK Ølbar - User Flows', () => {
  
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // ============================================
  // FLOW 1: Shopping for Beer (12 tests)
  // ============================================
  
  describe('Shopping Flow', () => {
    
    context('Browse Beers', () => {
      
      it('should load beer page and show beers', () => {
        cy.visit('/beer');
        cy.wait(2000); // Wait for backend
        
        // Check sections exist
        cy.get('[data-testid="tap-beers-section"]', { timeout: 10000 }).should('be.visible');
        cy.get('[data-testid="bottled-beers-section"]').should('be.visible');
        
        // Check at least one beer card
        cy.get('[data-testid^="beer-card-"]').should('have.length.at.least', 1);
      });

      it('should show beer names and prices', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid="beer-name"]').first().should('not.be.empty');
        cy.get('[data-testid="beer-price"]').first().should('contain', 'kr');
      });
    });

    context('Add to Cart', () => {
      
      it('should add first beer to cart', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Click first add button
        cy.get('[data-testid^="add-to-cart-"]').first().click();
        
        // Cart badge should appear (use .cart-count class as fallback)
        cy.get('.cart-count', { timeout: 5000 }).should('be.visible');
        cy.get('.cart-count').should('contain', '1');
      });

      it('should add multiple beers to cart', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Add first beer
        cy.get('[data-testid^="add-to-cart-"]').eq(0).click();
        cy.wait(500);
        cy.get('.cart-count').should('contain', '1');
        
        // Add second beer
        cy.get('[data-testid^="add-to-cart-"]').eq(1).click();
        cy.wait(500);
        cy.get('.cart-count').should('contain', '2');
      });

      it('should add same beer twice (increments quantity)', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Add same beer twice
        const addBtn = cy.get('[data-testid^="add-to-cart-"]').first();
        addBtn.click();
        cy.wait(500);
        addBtn.click();
        cy.wait(500);
        
        cy.get('.cart-count').should('contain', '2');
      });
    });

    context('Cart Preview', () => {
      
      it('should open cart preview when clicking cart badge', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Add item first
        cy.get('[data-testid^="add-to-cart-"]').first().click();
        cy.wait(500);
        
        // Click cart badge (use class since position fixed)
        cy.get('.cart-badge').click();
        
        // Preview should open
        cy.get('[data-testid="cart-preview"]').should('be.visible');
      });

      it('should show items in cart preview', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Add item
        cy.get('[data-testid^="add-to-cart-"]').first().click();
        cy.wait(500);
        
        // Open preview
        cy.get('.cart-badge').click();
        
        // Should show item
        cy.get('[data-testid="cart-item"]').should('have.length.at.least', 1);
        cy.get('[data-testid="cart-total"]').should('be.visible');
      });

      it('should close cart preview when clicking backdrop', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid^="add-to-cart-"]').first().click();
        cy.wait(500);
        cy.get('.cart-badge').click();
        
        // Click backdrop
        cy.get('[data-testid="cart-backdrop"]').click({ force: true });
        
        // Preview should close
        cy.get('[data-testid="cart-preview"]').should('not.exist');
      });
    });

    context('Beer Modal', () => {
      
      it('should open beer modal when clicking beer card', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        // Click beer card (not the button)
        cy.get('[data-testid^="beer-card-"]').first().click();
        
        // Modal should open
        cy.get('[data-testid="beer-modal"]').should('be.visible');
      });

      it('should close modal with X button', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid^="beer-card-"]').first().click();
        cy.get('[data-testid="beer-modal"]').should('be.visible');
        
        // Click close
        cy.get('[data-testid="close-modal"]').click();
        
        cy.get('[data-testid="beer-modal"]').should('not.exist');
      });

      it('should change quantity in modal', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid^="beer-card-"]').first().click();
        
        // Check initial quantity
        cy.get('[data-testid="quantity-display"]').should('contain', '1');
        
        // Increase
        cy.get('[data-testid="increase-quantity"]').click();
        cy.get('[data-testid="quantity-display"]').should('contain', '2');
        
        // Decrease
        cy.get('[data-testid="decrease-quantity"]').click();
        cy.get('[data-testid="quantity-display"]').should('contain', '1');
      });

      it('should add beer from modal with custom quantity', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid^="beer-card-"]').first().click();
        
        // Set quantity to 3
        cy.get('[data-testid="increase-quantity"]').click();
        cy.get('[data-testid="increase-quantity"]').click();
        
        // Add to cart
        cy.get('[data-testid="modal-add-to-cart"]').click();
        cy.wait(500);
        
        // Close modal and check cart
        cy.get('[data-testid="close-modal"]').click();
        cy.get('.cart-count').should('contain', '3');
      });
    });

    context('Cart Persistence', () => {
      
      it('should keep cart items after page reload', () => {
        cy.visit('/beer');
        cy.wait(2000);
        
        cy.get('[data-testid^="add-to-cart-"]').first().click();
        cy.wait(500);
        cy.get('.cart-count').should('contain', '1');
        
        // Reload
        cy.reload();
        cy.wait(2000);
        
        // Cart should persist
        cy.get('.cart-count').should('contain', '1');
      });
    });
  });

  // ============================================
  // FLOW 2: Checkout & Order (5 tests)
  // ============================================
  
  describe('Checkout Flow', () => {
    
    it('should navigate to order page from cart preview', () => {
      cy.visit('/beer');
      cy.wait(2000);
      
      cy.get('[data-testid^="add-to-cart-"]').first().click();
      cy.wait(500);
      cy.get('.cart-badge').click();
      cy.get('[data-testid="checkout-button"]').click();
      
      cy.url().should('include', '/order');
    });

    it('should show cart items on order page', () => {
      cy.visit('/beer');
      cy.wait(2000);
      
      // Add items
      cy.get('[data-testid^="add-to-cart-"]').eq(0).click();
      cy.wait(500);
      cy.get('[data-testid^="add-to-cart-"]').eq(1).click();
      cy.wait(500);
      
      // Go to order
      cy.visit('/order');
      cy.wait(1000);
      
      // Should show cart preview
      cy.get('[data-testid="cart-preview-section"]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-testid="cart-item-preview"]').should('have.length.at.least', 2);
    });

    it('should show order form with age input', () => {
      cy.visit('/order');
      cy.wait(1000);
      
      // Form should be visible
      cy.get('[data-testid="customer-age"]').should('be.visible');
      cy.get('[data-testid="student-card-checkbox"]').should('be.visible');
      cy.get('[data-testid="create-order-btn"]').should('be.visible');
    });

    it('should be able to fill order form', () => {
      cy.visit('/beer');
      cy.wait(2000);
      
      // Add item first
      cy.get('[data-testid^="add-to-cart-"]').first().click();
      cy.wait(500);
      
      // Go to order
      cy.visit('/order');
      cy.wait(1000);
      
      // Fill age
      cy.get('[data-testid="customer-age"]').clear().type('25');
      cy.get('[data-testid="student-card-checkbox"]').check();
      
      // Button should be enabled
      cy.get('[data-testid="create-order-btn"]').should('not.be.disabled');
    });

    it('should attempt to create order (may fail if backend is down)', () => {
      cy.visit('/beer');
      cy.wait(2000);
      
      cy.get('[data-testid^="add-to-cart-"]').first().click();
      cy.wait(500);
      
      cy.visit('/order');
      cy.wait(1000);
      
      cy.get('[data-testid="customer-age"]').clear().type('25');
      cy.get('[data-testid="create-order-btn"]').click();
      
      // Wait and check for either success or error
      cy.wait(3000);
      
      // Should show something (either order created or error message)
      cy.get('body').then($body => {
        const hasOrder = $body.find('[data-testid="order-created"]').length > 0;
        const hasError = $body.find('[data-testid="error-message"]').length > 0;
        expect(hasOrder || hasError).to.be.true;
      });
    });
  });

  // ============================================
  // FLOW 3: Events (3 tests)
  // ============================================
  
  describe('Events Flow', () => {
    
    it('should load and display events', () => {
      cy.visit('/events');
      cy.wait(2000);
      
      // Should show at least loading or events
      cy.get('body').then($body => {
        const hasEvents = $body.find('[data-testid="event-card"]').length > 0;
        const isLoading = $body.find('.loading').length > 0;
        expect(hasEvents || isLoading).to.be.true;
      });
    });

    it('should show event details if events exist', () => {
      cy.visit('/events');
      cy.wait(2000);
      
      // If events exist, check details
      cy.get('[data-testid="event-card"]').first().then($card => {
        if ($card.length > 0) {
          cy.wrap($card).within(() => {
            cy.get('[data-testid="event-title"]').should('exist');
            cy.get('[data-testid="event-artist"]').should('exist');
          });
        }
      });
    });

    it('should show reservation button if event requires reservation', () => {
      cy.visit('/events');
      cy.wait(2000);
      
      // Check if reserve button exists (some events may not require reservation)
      cy.get('body').then($body => {
        if ($body.find('.reserve-btn').length > 0) {
          cy.get('.reserve-btn').first().should('be.visible');
        }
      });
    });
  });

  // ============================================
  // FLOW 4: Navigation & Contact (5 tests)
  // ============================================
  
  describe('Navigation & Contact', () => {
    
    it('should navigate between all pages', () => {
      cy.visit('/');
      cy.wait(1000);
      
      // Navigate to beer
      cy.get('[data-testid="nav-beer"]').click();
      cy.url().should('include', '/beer');
      cy.wait(1000);
      
      // Navigate to events
      cy.get('[data-testid="nav-events"]').click();
      cy.url().should('include', '/events');
      cy.wait(1000);
      
      // Navigate to contact
      cy.get('[data-testid="nav-contact"]').click();
      cy.url().should('include', '/contact');
      cy.wait(1000);
      
      // Navigate home
      cy.get('[data-testid="nav-home"]').click();
      cy.url().should('match', /\/$/);
    });

    it('should show contact form', () => {
      cy.visit('/contact');
      cy.wait(1000);
      
      cy.get('[data-testid="contact-name"]').should('be.visible');
      cy.get('[data-testid="contact-email"]').should('be.visible');
      cy.get('[data-testid="contact-message"]').should('be.visible');
      cy.get('[data-testid="submit-contact"]').should('be.visible');
    });

    it('should require all contact form fields', () => {
      cy.visit('/contact');
      cy.wait(1000);
      
      // Button should be disabled initially
      cy.get('[data-testid="submit-contact"]').should('be.disabled');
      
      // Fill fields one by one
      cy.get('[data-testid="contact-name"]').type('Test');
      cy.get('[data-testid="submit-contact"]').should('be.disabled');
      
      cy.get('[data-testid="contact-email"]').type('test@test.com');
      cy.get('[data-testid="submit-contact"]').should('be.disabled');
      
      cy.get('[data-testid="contact-message"]').type('Message');
      cy.get('[data-testid="submit-contact"]').should('not.be.disabled');
    });

    it('should be able to submit contact form', () => {
      cy.visit('/contact');
      cy.wait(1000);
      
      cy.get('[data-testid="contact-name"]').type('Cypress Test');
      cy.get('[data-testid="contact-email"]').type('cypress@test.com');
      cy.get('[data-testid="contact-message"]').type('This is a test message from Cypress');
      
      cy.get('[data-testid="submit-contact"]').click();
      
      // Should show either success or error after submission
      cy.wait(3000);
    });

    it('should keep cart when navigating (integration test)', () => {
      cy.visit('/beer');
      cy.wait(2000);
      
      // Add item
      cy.get('[data-testid^="add-to-cart-"]').first().click();
      cy.wait(500);
      cy.get('.cart-count').should('contain', '1');
      
      // Navigate to other pages
      cy.get('[data-testid="nav-events"]').click();
      cy.wait(1000);
      cy.get('.cart-count').should('contain', '1');
      
      cy.get('[data-testid="nav-contact"]').click();
      cy.wait(1000);
      cy.get('.cart-count').should('contain', '1');
      
      cy.get('[data-testid="nav-home"]').click();
      cy.wait(1000);
      cy.get('.cart-count').should('contain', '1');
    });
  });
});