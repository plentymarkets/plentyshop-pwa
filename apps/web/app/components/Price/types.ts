export type PriceProps = {
  price: number;
  crossedPrice: number | null;
  displayVatHint?: boolean;
  size?: 'sm' | 'base';
  testId?: string;
};
