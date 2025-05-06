import { describe, it, expect } from 'vitest';
import { usePriceFormatter } from '../usePriceFormatter';

describe('usePriceFormatter', () => {
  describe('format', () => {
    it('should format a number without pattern to the i18n standard', () => {
      const { format } = usePriceFormatter();
      const { $i18n } = useNuxtApp();
      const value = 1234.56;
      const result = format(value);

      expect(result).toBe($i18n.n(value, 'currency'));
    });

    it('should format a number using the provided currency pattern', () => {
      const { setPattern, format } = usePriceFormatter();
      const currencyPattern = {
        pattern: '¤ #,##0.00',
        thousandsSeparator: ',',
        decimalSeparator: '.',
        decimalPlaces: 2,
        symbol: '$',
      };

      setPattern(currencyPattern);
      const result = format(1234.56);

      expect(result).toBe('$ 1,234.56');
    });

    it('should handle numbers with no decimal places', () => {
      const { setPattern, format } = usePriceFormatter();
      const currencyPattern = {
        pattern: '¤ #,##0',
        thousandsSeparator: ',',
        decimalSeparator: '.',
        decimalPlaces: 0,
        symbol: '€',
      };

      setPattern(currencyPattern);
      const result = format(1234);

      expect(result).toBe('€ 1,234');
    });

    it('should format a number with a symbol after the value', () => {
      const { setPattern, format } = usePriceFormatter();
      const currencyPattern = {
        pattern: '#,##0.00 ¤',
        thousandsSeparator: ',',
        decimalSeparator: '.',
        decimalPlaces: 2,
        symbol: '£',
      };

      setPattern(currencyPattern);
      const result = format(1234.56);

      expect(result).toBe('1,234.56 £');
    });

    it('should format a number with different separators', () => {
      const { setPattern, format } = usePriceFormatter();
      const currencyPattern = {
        pattern: '#,##0.00 ¤',
        thousandsSeparator: '.',
        decimalSeparator: ',',
        decimalPlaces: 2,
        symbol: '€',
      };

      setPattern(currencyPattern);
      const result = format(1234.56);

      expect(result).toBe('1.234,56 €');
    });

    it('should format a million number correctly', () => {
      const { setPattern, format } = usePriceFormatter();
      const currencyPattern = {
        pattern: '#,##0.00 ¤',
        thousandsSeparator: '.',
        decimalSeparator: ',',
        decimalPlaces: 2,
        symbol: '€',
      };

      setPattern(currencyPattern);
      const result = format(1234567.89);

      expect(result).toBe('1.234.567,89 €');
    });
  });
});