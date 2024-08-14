import type { Product } from '@plentymarkets/shop-api';

export interface UseQuickCheckoutState {
  loading: boolean;
  isOpen: boolean;
  timer: number;
  quantity: number;
  product: Product;
}

export type OpenQuickCheckout = (product: Product, quantity: number) => void;
export type CloseQuickCheckout = () => void;
export type StartTimer = () => void;
export type EndTimer = () => void;

export interface UseQuickCheckout {
  loading: Readonly<Ref<boolean>>;
  hasTimer: Ref<boolean>;
  isOpen: Readonly<Ref<UseQuickCheckoutState['isOpen']>>;
  timer: Readonly<Ref<UseQuickCheckoutState['timer']>>;
  quantity: Readonly<Ref<UseQuickCheckoutState['quantity']>>;
  product: Readonly<Ref<UseQuickCheckoutState['product']>>;
  openQuickCheckout: OpenQuickCheckout;
  closeQuickCheckout: CloseQuickCheckout;
  startTimer: StartTimer;
  endTimer: EndTimer;
}

export type UseQuickCheckoutReturn = () => UseQuickCheckout;
