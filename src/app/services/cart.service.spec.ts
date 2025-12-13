// src/app/services/cart.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Beer, BeerType } from '../models/beer.model';

describe('CartService', () => {
  let service: CartService;
  
  // Mock beers for testing
  const mockBeer1: Beer = {
    id: 1,
    name: 'Carlsberg',
    price: 45,
    description: 'Dansk pilsner',
    type: BeerType.TAP,
    available: true
  };

  const mockBeer2: Beer = {
    id: 2,
    name: 'Tuborg',
    price: 50,
    description: 'Frisk lager',
    type: BeerType.TAP,
    available: true
  };

  const mockBeer3: Beer = {
    id: 3,
    name: 'Corona',
    price: 55,
    description: 'Mexicansk lager',
    type: BeerType.BOTTLED,
    available: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset the service's internal state
    service.clearCart();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ============================================================
  // INITIALIZATION TESTS
  // ============================================================

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty cart', () => {
      expect(service.getCartItems().length).toBe(0);
      expect(service.getCartCount()).toBe(0);
      expect(service.getCartTotal()).toBe(0);
    });

    it('should expose cartItems$ observable', (done) => {
      service.cartItems$.subscribe(items => {
        expect(Array.isArray(items)).toBeTrue();
        done();
      });
    });
  });

  // ============================================================
  // ADD TO CART TESTS
  // ============================================================

  describe('addToCart()', () => {
    it('should add a single beer to empty cart', () => {
      service.addToCart(mockBeer1, 1);
      
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].beer).toEqual(mockBeer1);
      expect(items[0].quantity).toBe(1);
    });

    it('should add beer with default quantity of 1', () => {
      service.addToCart(mockBeer1);
      
      expect(service.getCartCount()).toBe(1);
    });

    it('should add beer with custom quantity', () => {
      service.addToCart(mockBeer1, 5);
      
      const items = service.getCartItems();
      expect(items[0].quantity).toBe(5);
      expect(service.getCartCount()).toBe(5);
    });

    it('should add multiple different beers', () => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
      
      const items = service.getCartItems();
      expect(items.length).toBe(2);
      expect(service.getCartCount()).toBe(5);
    });

    it('should increment quantity when adding same beer twice', () => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer1, 3);
      
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(5);
      expect(service.getCartCount()).toBe(5);
    });

    it('should emit updated cart through observable', (done) => {
      let emissionCount = 0;
      
      service.cartItems$.subscribe(items => {
        emissionCount++;
        if (emissionCount === 2) { // Skip initial emission
          expect(items.length).toBe(1);
          expect(items[0].beer.id).toBe(mockBeer1.id);
          done();
        }
      });
      
      service.addToCart(mockBeer1, 1);
    });
  });

  // ============================================================
  // REMOVE FROM CART TESTS
  // ============================================================

  describe('removeFromCart()', () => {
    beforeEach(() => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
      service.addToCart(mockBeer3, 1);
    });

    it('should remove beer from cart', () => {
      service.removeFromCart(mockBeer2.id!);
      
      const items = service.getCartItems();
      expect(items.length).toBe(2);
      expect(items.find(i => i.beer.id === mockBeer2.id)).toBeUndefined();
    });

    it('should update cart count after removal', () => {
      expect(service.getCartCount()).toBe(6); // 2 + 3 + 1
      
      service.removeFromCart(mockBeer2.id!); // Remove 3 items
      
      expect(service.getCartCount()).toBe(3); // 2 + 1
    });

    it('should handle removing non-existent beer gracefully', () => {
      const initialCount = service.getCartItems().length;
      
      service.removeFromCart(999); // Non-existent ID
      
      expect(service.getCartItems().length).toBe(initialCount);
    });

    it('should handle removing from empty cart', () => {
      service.clearCart();
      
      service.removeFromCart(mockBeer1.id!);
      
      expect(service.getCartItems().length).toBe(0);
    });
  });

  // ============================================================
  // UPDATE QUANTITY TESTS
  // ============================================================

  describe('updateQuantity()', () => {
    beforeEach(() => {
      service.addToCart(mockBeer1, 5);
    });

    it('should update quantity to new value', () => {
      service.updateQuantity(mockBeer1.id!, 10);
      
      expect(service.getQuantity(mockBeer1.id!)).toBe(10);
    });

    it('should remove item when quantity is set to 0', () => {
      service.updateQuantity(mockBeer1.id!, 0);
      
      expect(service.getCartItems().length).toBe(0);
      expect(service.isInCart(mockBeer1.id!)).toBeFalse();
    });

    it('should remove item when quantity is negative', () => {
      service.updateQuantity(mockBeer1.id!, -5);
      
      expect(service.getCartItems().length).toBe(0);
    });

    it('should not affect other items', () => {
      service.addToCart(mockBeer2, 3);
      
      service.updateQuantity(mockBeer1.id!, 8);
      
      expect(service.getQuantity(mockBeer1.id!)).toBe(8);
      expect(service.getQuantity(mockBeer2.id!)).toBe(3);
    });

    it('should handle updating non-existent beer', () => {
      service.updateQuantity(999, 10);
      
      // Should not add new item or crash
      expect(service.getCartItems().length).toBe(1);
    });
  });

  // ============================================================
  // CLEAR CART TESTS
  // ============================================================

  describe('clearCart()', () => {
    it('should remove all items from cart', () => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
      service.addToCart(mockBeer3, 1);
      
      service.clearCart();
      
      expect(service.getCartItems().length).toBe(0);
      expect(service.getCartCount()).toBe(0);
      expect(service.getCartTotal()).toBe(0);
    });

    it('should clear empty cart without errors', () => {
      service.clearCart();
      
      expect(service.getCartItems().length).toBe(0);
    });
  });

  // ============================================================
  // CART COUNT TESTS
  // ============================================================

  describe('getCartCount()', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getCartCount()).toBe(0);
    });

    it('should return total quantity of single item', () => {
      service.addToCart(mockBeer1, 5);
      
      expect(service.getCartCount()).toBe(5);
    });

    it('should return sum of all item quantities', () => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
      service.addToCart(mockBeer3, 4);
      
      expect(service.getCartCount()).toBe(9);
    });

    it('should update count after adding more of same beer', () => {
      service.addToCart(mockBeer1, 2);
      expect(service.getCartCount()).toBe(2);
      
      service.addToCart(mockBeer1, 3);
      expect(service.getCartCount()).toBe(5);
    });
  });

  // ============================================================
  // CART TOTAL TESTS (Price Calculation)
  // ============================================================

  describe('getCartTotal()', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getCartTotal()).toBe(0);
    });

    it('should calculate total for single item', () => {
      service.addToCart(mockBeer1, 2); // 45 * 2 = 90
      
      expect(service.getCartTotal()).toBe(90);
    });

    it('should calculate total for multiple items', () => {
      service.addToCart(mockBeer1, 2); // 45 * 2 = 90
      service.addToCart(mockBeer2, 3); // 50 * 3 = 150
      service.addToCart(mockBeer3, 1); // 55 * 1 = 55
      
      expect(service.getCartTotal()).toBe(295);
    });

    it('should update total when quantity changes', () => {
      service.addToCart(mockBeer1, 2); // 90
      expect(service.getCartTotal()).toBe(90);
      
      service.updateQuantity(mockBeer1.id!, 5); // 225
      expect(service.getCartTotal()).toBe(225);
    });

    it('should update total when item is removed', () => {
      service.addToCart(mockBeer1, 2); // 90
      service.addToCart(mockBeer2, 3); // 150
      expect(service.getCartTotal()).toBe(240);
      
      service.removeFromCart(mockBeer1.id!);
      expect(service.getCartTotal()).toBe(150);
    });
  });

  // ============================================================
  // QUERY METHODS TESTS
  // ============================================================

  describe('isInCart()', () => {
    beforeEach(() => {
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
    });

    it('should return true for beer in cart', () => {
      expect(service.isInCart(mockBeer1.id!)).toBeTrue();
      expect(service.isInCart(mockBeer2.id!)).toBeTrue();
    });

    it('should return false for beer not in cart', () => {
      expect(service.isInCart(mockBeer3.id!)).toBeFalse();
      expect(service.isInCart(999)).toBeFalse();
    });

    it('should return false after beer is removed', () => {
      service.removeFromCart(mockBeer1.id!);
      
      expect(service.isInCart(mockBeer1.id!)).toBeFalse();
    });
  });

  describe('getQuantity()', () => {
    beforeEach(() => {
      service.addToCart(mockBeer1, 5);
      service.addToCart(mockBeer2, 3);
    });

    it('should return correct quantity for beer in cart', () => {
      expect(service.getQuantity(mockBeer1.id!)).toBe(5);
      expect(service.getQuantity(mockBeer2.id!)).toBe(3);
    });

    it('should return 0 for beer not in cart', () => {
      expect(service.getQuantity(mockBeer3.id!)).toBe(0);
      expect(service.getQuantity(999)).toBe(0);
    });

    it('should return 0 after beer is removed', () => {
      service.removeFromCart(mockBeer1.id!);
      
      expect(service.getQuantity(mockBeer1.id!)).toBe(0);
    });
  });

  // ============================================================
  // LOCAL STORAGE INTEGRATION TESTS
  // ============================================================

  describe('localStorage Integration', () => {
    it('should save cart to localStorage when adding item', () => {
      service.addToCart(mockBeer1, 2);
      
      const stored = localStorage.getItem('ek-oelbar-cart');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].beer.id).toBe(mockBeer1.id);
      expect(parsed[0].quantity).toBe(2);
    });

    it('should load cart from localStorage on initialization', () => {
      // Manually set localStorage
      const cartData: CartItem[] = [
        { beer: mockBeer1, quantity: 3 },
        { beer: mockBeer2, quantity: 2 }
      ];
      localStorage.setItem('ek-oelbar-cart', JSON.stringify(cartData));
      
      // Create new service instance
      const newService = new CartService();
      
      expect(newService.getCartItems().length).toBe(2);
      expect(newService.getCartCount()).toBe(5);
    });

    it('should persist cart across service instances', () => {
      service.addToCart(mockBeer1, 4);
      service.addToCart(mockBeer2, 2);
      
      // Create new instance
      const newService = TestBed.inject(CartService);
      
      expect(newService.getCartCount()).toBe(6);
      expect(newService.getCartTotal()).toBe(280); // (45*4) + (50*2)
    });

    it('should clear localStorage when cart is cleared', () => {
      service.addToCart(mockBeer1, 2);
      expect(localStorage.getItem('ek-oelbar-cart')).toBeTruthy();
      
      service.clearCart();
      
      const stored = localStorage.getItem('ek-oelbar-cart');
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(0);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('ek-oelbar-cart', 'invalid json data');
      
      const newService = new CartService();
      
      expect(newService.getCartItems().length).toBe(0);
    });

    it('should handle missing localStorage gracefully', () => {
      localStorage.removeItem('ek-oelbar-cart');
      
      const newService = new CartService();
      
      expect(newService.getCartItems().length).toBe(0);
    });
  });

  // ============================================================
  // EDGE CASES AND ERROR HANDLING
  // ============================================================

  describe('Edge Cases', () => {
    it('should handle adding beer with quantity 0', () => {
      service.addToCart(mockBeer1, 0);
      
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(0);
    });

    it('should handle large quantities', () => {
      service.addToCart(mockBeer1, 1000);
      
      expect(service.getCartCount()).toBe(1000);
      expect(service.getCartTotal()).toBe(45000);
    });

    it('should handle multiple rapid updates', () => {
      for (let i = 0; i < 10; i++) {
        service.addToCart(mockBeer1, 1);
      }
      
      expect(service.getQuantity(mockBeer1.id!)).toBe(10);
    });

    it('should maintain cart integrity after multiple operations', () => {
      // Complex sequence of operations
      service.addToCart(mockBeer1, 2);
      service.addToCart(mockBeer2, 3);
      service.addToCart(mockBeer3, 1);
      service.removeFromCart(mockBeer2.id!);
      service.updateQuantity(mockBeer1.id!, 5);
      service.addToCart(mockBeer3, 2); // Increment existing
      
      expect(service.getCartItems().length).toBe(2);
      expect(service.getQuantity(mockBeer1.id!)).toBe(5);
      expect(service.getQuantity(mockBeer3.id!)).toBe(3);
      expect(service.getCartTotal()).toBe(390); // (45*5) + (55*3)
    });
  });

  // ============================================================
  // OBSERVABLE BEHAVIOR TESTS
  // ============================================================

  describe('Observable Behavior', () => {
    it('should emit on every cart change', (done) => {
      let emissionCount = 0;
      const expectedEmissions = 3; // Initial + 2 additions
      
      service.cartItems$.subscribe(() => {
        emissionCount++;
        if (emissionCount === expectedEmissions) {
          done();
        }
      });
      
      service.addToCart(mockBeer1, 1);
      service.addToCart(mockBeer2, 2);
    });

    it('should provide current cart state to new subscribers', (done) => {
      service.addToCart(mockBeer1, 5);
      service.addToCart(mockBeer2, 3);
      
      // New subscription should immediately get current state
      service.cartItems$.subscribe(items => {
        expect(items.length).toBe(2);
        expect(items[0].quantity).toBe(5);
        done();
      });
    });
  });
});