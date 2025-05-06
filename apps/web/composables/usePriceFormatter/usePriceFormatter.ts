import type { CurrencyPattern } from '@plentymarkets/shop-api';

export const usePriceFormatter = () => {
  const state = useState('usePriceFormatter', () => ({
    pattern: '',
    thousandSeparator: '',
    decimalSeparator: '',
    decimalPlaces: 2,
    spaceBeforeSymbol: false,
    symbolBeforeValue: true,
    currency: '',
  }));

  const setPattern = (currencyPattern: CurrencyPattern | undefined) => {
    if (currencyPattern?.pattern) {
      state.value.thousandSeparator = currencyPattern?.thousandsSeparator ?? '';
      state.value.decimalSeparator = currencyPattern?.decimalSeparator ?? '';
      state.value.decimalPlaces = currencyPattern?.decimalPlaces ?? 2;
      state.value.spaceBeforeSymbol =
        /\s¤/.test(currencyPattern.pattern) || /¤\s/.test(currencyPattern.pattern) || currencyPattern.symbol.length > 1;
      state.value.symbolBeforeValue = currencyPattern.pattern.indexOf('¤') < currencyPattern.pattern.indexOf('#');
      state.value.currency = currencyPattern?.symbol ?? '';
      state.value.pattern = currencyPattern?.pattern ?? '';
    }
  };

  const format = (value: number) => {
    if (state.value.pattern === '') {
      const { n } = useI18n();
      return n(value, 'currency');
    }

    const numberParts = value.toFixed(state.value.decimalPlaces).split('.');
    let integerPart = numberParts[0];
    const decimalPart = numberParts[1];

    if (state.value.thousandSeparator) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, state.value.thousandSeparator);
    }

    let formattedNumber = integerPart;
    if (decimalPart !== undefined && state.value.decimalSeparator) {
      formattedNumber += state.value.decimalSeparator + decimalPart;
    }

    if (state.value.symbolBeforeValue) {
      formattedNumber = state.value.currency + (state.value.spaceBeforeSymbol ? ' ' : '') + formattedNumber;
    } else {
      formattedNumber += (state.value.spaceBeforeSymbol ? ' ' : '') + state.value.currency;
    }

    return formattedNumber;
  };

  return {
    setPattern,
    format,
  };
};
