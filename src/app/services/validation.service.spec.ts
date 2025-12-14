import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // AGE VALIDATION TESTS (18-120)
  describe('isValidAge()', () => {
    
    // Equivalence Partitioning Tests
    describe('Equivalence Partitioning', () => {
      it('EP-AGE-01: should reject negative age', () => {
        const result = service.isValidAge(-10);
        expect(result.valid).toBeFalse();
      });

      it('EP-AGE-02: should reject zero age', () => {
        const result = service.isValidAge(0);
        expect(result.valid).toBeFalse();
      });

      it('EP-AGE-03: should reject underage (1-17)', () => {
        const result = service.isValidAge(10);
        expect(result.valid).toBeFalse();
      });

      it('EP-AGE-04: should accept valid age (18-120)', () => {
        const result = service.isValidAge(50);
        expect(result.valid).toBeTrue();
      });

      it('EP-AGE-05: should reject over maximum (>120)', () => {
        const result = service.isValidAge(150);
        expect(result.valid).toBeFalse();
      });

      it('EP-AGE-06: should reject null age', () => {
        const result = service.isValidAge(null);
        expect(result.valid).toBeFalse();
        expect(result.error).toBeTruthy();
      });

      it('EP-AGE-07: should reject undefined age', () => {
        const result = service.isValidAge(undefined);
        expect(result.valid).toBeFalse();
      });
    });

    // Boundary Value Analysis Tests
    describe('Boundary Value Analysis', () => {
      it('BVA-AGE-01: should reject 16 (LB - 2)', () => {
        expect(service.isValidAge(16).valid).toBeFalse();
      });

      it('BVA-AGE-02: should reject 17 (LB - 1)', () => {
        expect(service.isValidAge(17).valid).toBeFalse();
      });

      it('BVA-AGE-03: should accept 18 (LB)', () => {
        expect(service.isValidAge(18).valid).toBeTrue();
      });

      it('BVA-AGE-04: should accept 19 (LB + 1)', () => {
        expect(service.isValidAge(19).valid).toBeTrue();
      });

      it('BVA-AGE-05: should accept 119 (UB - 1)', () => {
        expect(service.isValidAge(119).valid).toBeTrue();
      });

      it('BVA-AGE-06: should accept 120 (UB)', () => {
        expect(service.isValidAge(120).valid).toBeTrue();
      });

      it('BVA-AGE-07: should reject 121 (UB + 1)', () => {
        expect(service.isValidAge(121).valid).toBeFalse();
      });

      it('BVA-AGE-08: should reject 122 (UB + 2)', () => {
        expect(service.isValidAge(122).valid).toBeFalse();
      });
    });
  });

  // EMAIL VALIDATION TESTS
  describe('isValidEmail()', () => {

    describe('Equivalence Partitioning', () => {
      it('EP-EMA-01: should reject null email', () => {
        expect(service.isValidEmail(null).valid).toBeFalse();
      });

      it('EP-EMA-02: should reject empty string', () => {
        expect(service.isValidEmail('').valid).toBeFalse();
      });

      it('EP-EMA-03: should reject whitespace only', () => {
        expect(service.isValidEmail('   ').valid).toBeFalse();
      });

      it('EP-EMA-04: should reject email without @', () => {
        expect(service.isValidEmail('testexample.com').valid).toBeFalse();
      });

      it('EP-EMA-05: should reject email with @ at position 0', () => {
        expect(service.isValidEmail('@example.com').valid).toBeFalse();
      });

      it('EP-EMA-06: should reject email without dot in domain', () => {
        expect(service.isValidEmail('test@example').valid).toBeFalse();
      });

      it('EP-EMA-07: should reject email with dot at domain start', () => {
        expect(service.isValidEmail('test@.example.com').valid).toBeFalse();
      });

      it('EP-EMA-08: should reject email with dot at domain end', () => {
        expect(service.isValidEmail('test@example.').valid).toBeFalse();
      });

      it('EP-EMA-09: should accept valid email format', () => {
        expect(service.isValidEmail('test@example.com').valid).toBeTrue();
      });

      it('EP-EMA-10: should reject email with only domain part', () => {
        expect(service.isValidEmail('test@').valid).toBeFalse();
      });

      it('EP-EMA-11: should accept email with subdomain', () => {
        expect(service.isValidEmail('test@sub.example.com').valid).toBeTrue();
      });

      it('EP-EMA-12: should reject email with multiple @', () => {
        expect(service.isValidEmail('test@@example.com').valid).toBeFalse();
      });

      it('EP-EMA-13: should accept short but valid email', () => {
        expect(service.isValidEmail('t@e.co').valid).toBeTrue();
      });

      it('EP-EMA-14: should reject email with leading/trailing spaces', () => {
        expect(service.isValidEmail(' test@example.com ').valid).toBeFalse();
      });

      it('EP-EMA-15: should reject email with space inside', () => {
        expect(service.isValidEmail('te st@example.com').valid).toBeFalse();
      });

      it('EP-EMA-16: should accept uppercase email (case-insensitive)', () => {
        expect(service.isValidEmail('TEST@EXAMPLE.COM').valid).toBeTrue();
      });
    });
  });

  // MESSAGE VALIDATION TESTS (1-2000 chars)
  describe('isValidMessage()', () => {

    describe('Equivalence Partitioning', () => {
      it('EP-MSG-01: should reject null message', () => {
        expect(service.isValidMessage(null).valid).toBeFalse();
      });

      it('EP-MSG-02: should reject empty string', () => {
        expect(service.isValidMessage('').valid).toBeFalse();
      });

      it('EP-MSG-03: should accept valid message', () => {
        expect(service.isValidMessage('Hello Test').valid).toBeTrue();
      });

      it('EP-MSG-04: should reject message over 2000 chars', () => {
        const longMessage = 'A'.repeat(2500);
        expect(service.isValidMessage(longMessage).valid).toBeFalse();
      });

      it('EP-MSG-05: should accept message with Danish characters', () => {
        expect(service.isValidMessage('Hello test - æøå').valid).toBeTrue();
      });

      it('EP-MSG-06: should accept message with special characters', () => {
        expect(service.isValidMessage('Hi! @#$% (test)').valid).toBeTrue();
      });

      it('EP-MSG-07: should reject whitespace-only message', () => {
        expect(service.isValidMessage('   ').valid).toBeFalse();
      });
    });

    describe('Boundary Value Analysis', () => {
      it('BVA-MSG-01: should reject empty string (LB - 1)', () => {
        expect(service.isValidMessage('').valid).toBeFalse();
      });

      it('BVA-MSG-02: should accept single character (LB)', () => {
        expect(service.isValidMessage('A').valid).toBeTrue();
      });

      it('BVA-MSG-03: should accept two characters (LB + 1)', () => {
        expect(service.isValidMessage('AA').valid).toBeTrue();
      });

      it('BVA-MSG-04: should accept 1999 characters (UB - 1)', () => {
        const msg = 'A'.repeat(1999);
        expect(service.isValidMessage(msg).valid).toBeTrue();
      });

      it('BVA-MSG-05: should accept 2000 characters (UB)', () => {
        const msg = 'A'.repeat(2000);
        expect(service.isValidMessage(msg).valid).toBeTrue();
      });

      it('BVA-MSG-06: should reject 2001 characters (UB + 1)', () => {
        const msg = 'A'.repeat(2001);
        expect(service.isValidMessage(msg).valid).toBeFalse();
      });

      it('BVA-MSG-07: should reject 2002 characters (UB + 2)', () => {
        const msg = 'A'.repeat(2002);
        expect(service.isValidMessage(msg).valid).toBeFalse();
      });
    });
  });

  // NAME VALIDATION TESTS (1-100 chars, letters only)
  describe('isValidName()', () => {

    describe('Equivalence Partitioning', () => {
      it('EP-NAM-01: should reject null name', () => {
        expect(service.isValidName(null).valid).toBeFalse();
      });

      it('EP-NAM-02: should reject empty string', () => {
        expect(service.isValidName('').valid).toBeFalse();
      });

      it('EP-NAM-03: should accept valid name', () => {
        expect(service.isValidName('Test').valid).toBeTrue();
      });

      it('EP-NAM-04: should reject name over 100 chars', () => {
        const longName = 'A'.repeat(200);
        expect(service.isValidName(longName).valid).toBeFalse();
      });

      it('EP-NAM-05: should accept Danish characters', () => {
        expect(service.isValidName('Test æøå').valid).toBeTrue();
      });

      it('EP-NAM-06: should reject special characters', () => {
        expect(service.isValidName('Test! @#$% (test)').valid).toBeFalse();
      });

      it('EP-NAM-07: should reject whitespace-only name', () => {
        expect(service.isValidName('   ').valid).toBeFalse();
      });

      it('EP-NAM-08: should accept hyphen and apostrophe', () => {
        expect(service.isValidName("Test O'Neil-Smith").valid).toBeTrue();
      });

      it('EP-NAM-09: should reject digits in name', () => {
        expect(service.isValidName('Test2').valid).toBeFalse();
      });

      it('EP-NAM-10: should reject underscore in name', () => {
        expect(service.isValidName('Test_Name').valid).toBeFalse();
      });
    });

    describe('Boundary Value Analysis', () => {
      it('BVA-NAM-01: should reject empty string (LB - 1)', () => {
        expect(service.isValidName('').valid).toBeFalse();
      });

      it('BVA-NAM-02: should accept single character (LB)', () => {
        expect(service.isValidName('A').valid).toBeTrue();
      });

      it('BVA-NAM-03: should accept two characters (LB + 1)', () => {
        expect(service.isValidName('AA').valid).toBeTrue();
      });

      it('BVA-NAM-04: should accept 99 characters (UB - 1)', () => {
        const name = 'A'.repeat(99);
        expect(service.isValidName(name).valid).toBeTrue();
      });

      it('BVA-NAM-05: should accept 100 characters (UB)', () => {
        const name = 'A'.repeat(100);
        expect(service.isValidName(name).valid).toBeTrue();
      });

      it('BVA-NAM-06: should reject 101 characters (UB + 1)', () => {
        const name = 'A'.repeat(101);
        expect(service.isValidName(name).valid).toBeFalse();
      });

      it('BVA-NAM-07: should reject 102 characters (UB + 2)', () => {
        const name = 'A'.repeat(102);
        expect(service.isValidName(name).valid).toBeFalse();
      });
    });
  });

  // GUEST COUNT VALIDATION TESTS (1-20)
  describe('isValidGuestCount()', () => {

    describe('Equivalence Partitioning', () => {
      it('EP-GUE-01: should reject negative guest count', () => {
        expect(service.isValidGuestCount(-5).valid).toBeFalse();
      });

      it('EP-GUE-02: should reject zero guests', () => {
        expect(service.isValidGuestCount(0).valid).toBeFalse();
      });

      it('EP-GUE-03: should accept valid guest count', () => {
        expect(service.isValidGuestCount(10).valid).toBeTrue();
      });

      it('EP-GUE-04: should reject guest count over 20', () => {
        expect(service.isValidGuestCount(25).valid).toBeFalse();
      });

      it('EP-GUE-05: should reject null guest count', () => {
        expect(service.isValidGuestCount(null).valid).toBeFalse();
      });

      it('EP-GUE-06: should reject undefined guest count', () => {
        expect(service.isValidGuestCount(undefined).valid).toBeFalse();
      });
    });

    describe('Boundary Value Analysis', () => {
      it('BVA-GUE-01: should reject -1 (LB - 2)', () => {
        expect(service.isValidGuestCount(-1).valid).toBeFalse();
      });

      it('BVA-GUE-02: should reject 0 (LB - 1)', () => {
        expect(service.isValidGuestCount(0).valid).toBeFalse();
      });

      it('BVA-GUE-03: should accept 1 (LB)', () => {
        expect(service.isValidGuestCount(1).valid).toBeTrue();
      });

      it('BVA-GUE-04: should accept 2 (LB + 1)', () => {
        expect(service.isValidGuestCount(2).valid).toBeTrue();
      });

      it('BVA-GUE-05: should accept 19 (UB - 1)', () => {
        expect(service.isValidGuestCount(19).valid).toBeTrue();
      });

      it('BVA-GUE-06: should accept 20 (UB)', () => {
        expect(service.isValidGuestCount(20).valid).toBeTrue();
      });

      it('BVA-GUE-07: should reject 21 (UB + 1)', () => {
        expect(service.isValidGuestCount(21).valid).toBeFalse();
      });

      it('BVA-GUE-08: should reject 22 (UB + 2)', () => {
        expect(service.isValidGuestCount(22).valid).toBeFalse();
      });
    });
  });

  // QUANTITY VALIDATION TESTS (1-10)
  describe('isValidQuantity()', () => {

    describe('Equivalence Partitioning', () => {
      it('EP-QTY-01: should reject negative quantity', () => {
        expect(service.isValidQuantity(-10).valid).toBeFalse();
      });

      it('EP-QTY-02: should reject zero quantity', () => {
        expect(service.isValidQuantity(0).valid).toBeFalse();
      });

      it('EP-QTY-03: should accept valid quantity', () => {
        expect(service.isValidQuantity(5).valid).toBeTrue();
      });

      it('EP-QTY-04: should reject quantity over 10', () => {
        expect(service.isValidQuantity(15).valid).toBeFalse();
      });

      it('EP-QTY-05: should reject null quantity', () => {
        expect(service.isValidQuantity(null).valid).toBeFalse();
      });

      it('EP-QTY-06: should reject undefined quantity', () => {
        expect(service.isValidQuantity(undefined).valid).toBeFalse();
      });
    });

    describe('Boundary Value Analysis', () => {
      it('BVA-QTY-01: should reject -1 (LB - 2)', () => {
        expect(service.isValidQuantity(-1).valid).toBeFalse();
      });

      it('BVA-QTY-02: should reject 0 (LB - 1)', () => {
        expect(service.isValidQuantity(0).valid).toBeFalse();
      });

      it('BVA-QTY-03: should accept 1 (LB)', () => {
        expect(service.isValidQuantity(1).valid).toBeTrue();
      });

      it('BVA-QTY-04: should accept 2 (LB + 1)', () => {
        expect(service.isValidQuantity(2).valid).toBeTrue();
      });

      it('BVA-QTY-05: should accept 9 (UB - 1)', () => {
        expect(service.isValidQuantity(9).valid).toBeTrue();
      });

      it('BVA-QTY-06: should accept 10 (UB)', () => {
        expect(service.isValidQuantity(10).valid).toBeTrue();
      });

      it('BVA-QTY-07: should reject 11 (UB + 1)', () => {
        expect(service.isValidQuantity(11).valid).toBeFalse();
      });

      it('BVA-QTY-08: should reject 12 (UB + 2)', () => {
        expect(service.isValidQuantity(12).valid).toBeFalse();
      });
    });
  });
});