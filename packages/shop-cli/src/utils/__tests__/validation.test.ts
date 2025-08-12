import { describe, it, expect } from 'vitest';
import {
  validateComponentName,
  validateComposableName,
  validateDescription,
  validateNotEmpty,
} from '../validation';

describe('Validation Utilities', () => {
  describe('validateComponentName', () => {
    it('should accept valid PascalCase names', () => {
      expect(validateComponentName('ProductCard')).toBe(true);
      expect(validateComponentName('UserProfile')).toBe(true);
      expect(validateComponentName('API')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(validateComponentName('productCard')).toContain('PascalCase');
      expect(validateComponentName('product-card')).toContain('PascalCase');
      expect(validateComponentName('123Product')).toContain('PascalCase');
      expect(validateComponentName('product_card')).toContain('PascalCase');
    });

    it('should reject reserved words', () => {
      expect(validateComponentName('Class')).toContain('reserved word');
      expect(validateComponentName('Function')).toContain('reserved word');
      expect(validateComponentName('Import')).toContain('reserved word');
    });

    it('should reject Vue reserved names', () => {
      expect(validateComponentName('Component')).toContain('reserved by Vue');
      expect(validateComponentName('Transition')).toContain('reserved by Vue');
      expect(validateComponentName('Suspense')).toContain('reserved by Vue');
    });

    it('should reject HTML element names', () => {
      expect(validateComponentName('Div')).toContain('conflicts with HTML');
      expect(validateComponentName('Button')).toContain('conflicts with HTML');
      expect(validateComponentName('Form')).toContain('conflicts with HTML');
    });

    it('should reject names that are too short or too long', () => {
      expect(validateComponentName('A')).toContain('at least 2 characters');
      expect(validateComponentName('A'.repeat(51))).toContain('should not exceed 50');
    });

    it('should reject consecutive numbers', () => {
      expect(validateComponentName('Product123Card')).toContain('consecutive numbers');
      expect(validateComponentName('User99Profile')).toContain('consecutive numbers');
    });

    it('should handle edge cases', () => {
      expect(validateComponentName('')).toContain('required');
      expect(validateComponentName(null)).toContain('required');
      expect(validateComponentName(undefined)).toContain('required');
      expect(validateComponentName(123)).toContain('required');
    });
  });

  describe('validateComposableName', () => {
    it('should accept valid composable names', () => {
      expect(validateComposableName('useProductCart')).toBe(true);
      expect(validateComposableName('useAPI')).toBe(true);
    });

    it('should reject names without "use" prefix', () => {
      expect(validateComposableName('productCart')).toContain('start with "use"');
      expect(validateComposableName('getProduct')).toContain('start with "use"');
    });

    it('should reject invalid formats', () => {
      expect(validateComposableName('useproductCart')).toContain('camelCase');
      expect(validateComposableName('use-product-cart')).toContain('camelCase');
      expect(validateComposableName('use_product_cart')).toContain('camelCase');
    });

    it('should reject names that are too short or too long', () => {
      expect(validateComposableName('use')).toContain('at least 4 characters');
      expect(validateComposableName('use' + 'A'.repeat(48))).toContain('should not exceed 50');
    });

    it('should reject consecutive numbers', () => {
      expect(validateComposableName('useProduct123Data')).toContain('consecutive numbers');
    });
  });

  describe('validateDescription', () => {
    it('should accept valid descriptions', () => {
      expect(validateDescription('This is a valid description for the component')).toBe(true);
      expect(validateDescription('A'.repeat(50))).toBe(true);
    });

    it('should accept empty/null descriptions (optional)', () => {
      expect(validateDescription('')).toBe(true);
      expect(validateDescription(null)).toBe(true);
      expect(validateDescription(undefined)).toBe(true);
    });

    it('should reject descriptions that are too short', () => {
      expect(validateDescription('short')).toContain('at least 10 characters');
    });

    it('should reject descriptions that are too long', () => {
      expect(validateDescription('A'.repeat(201))).toContain('should not exceed 200');
    });
  });

  describe('validateNotEmpty', () => {
    it('should accept non-empty strings', () => {
      expect(validateNotEmpty('valid string')).toBe(true);
      expect(validateNotEmpty(' valid ')).toBe(true);
    });

    it('should reject empty or invalid values', () => {
      expect(validateNotEmpty('')).toContain('required');
      expect(validateNotEmpty('   ')).toContain('required');
      expect(validateNotEmpty(null)).toContain('required');
      expect(validateNotEmpty(undefined)).toContain('required');
    });
  });
});
