# Currency Formatter

:::warning
Do not use `$n(value, 'currency')` or `n(value, 'currency')`!
These functions do not take our custom currency settings into account (e.g. correct locale, currency code, symbol placement, rounding logic). They may result in inconsistent formatting across the shop.
:::

Use the `usePriceFormatter` composable to format numbers as currency values. This utility ensures that all prices are consistently displayed according to our locale settings, including the correct currency symbol, thousands separators, and decimal precision.

## Usage

```typescript
const { format } = usePriceFormatter();
format(1234567.89);
```

## How it works

On the initialization call the backend provides the correct pattern for the current locale and currency. The pattern is then used to format the number.
We also update the pattern when the locale changes, so that the formatting is always correct.
