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

  const formatWithSymbol = (value: number, symbol: string) => {
    if (state.value.pattern === '') {
      const { $i18n } = useNuxtApp();
      // eslint-disable-next-line custom-rules/no-i18n-globals
      return $i18n.n(value, 'currency');
    }

    const numberParts = value.toFixed(state.value.decimalPlaces).split('.');
    let integerPart = numberParts[0];
    const decimalPart = numberParts[1];

    let spaceBeforeSymbol = state.value.spaceBeforeSymbol;

    if (!spaceBeforeSymbol && symbol.length > 1) {
      spaceBeforeSymbol = true;
    }

    if (state.value.thousandSeparator) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, state.value.thousandSeparator);
    }

    let formattedNumber = integerPart;
    if (decimalPart !== undefined && state.value.decimalSeparator) {
      formattedNumber += state.value.decimalSeparator + decimalPart;
    }

    if (state.value.symbolBeforeValue) {
      formattedNumber = symbol + (spaceBeforeSymbol ? ' ' : '') + formattedNumber;
    } else {
      formattedNumber += (spaceBeforeSymbol ? ' ' : '') + symbol;
    }

    return formattedNumber;
  };

  const format = (value: number) => {
    return formatWithSymbol(value, state.value.currency);
  };

  return {
    setPattern,
    format,
    formatWithSymbol,
  };
};
