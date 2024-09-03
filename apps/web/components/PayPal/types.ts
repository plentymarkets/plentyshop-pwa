export type PaypalButtonPropsType = {
  type: string;
  disabled?: boolean;
};

export type PayPalAddToCartCallback = (successfully: boolean) => void;

export type PayPalPayLaterBannerType = {
  placement: 'home' | 'product' | 'cart' | 'category' | 'payment';
  amount: number;
};
