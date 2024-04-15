import type { Ref } from 'vue';

export interface UseQuickCheckoutState {
  loading: boolean;
  isOpen: boolean;
  timer: number;
}

export type OpenQuickCheckout = () => void;
export type CloseQuickCheckout = () => void;
export type StartTimer = () => void;
export type EndTimer = () => void;

export interface UseQuickCheckout {
  loading: Readonly<Ref<boolean>>;
  isOpen: Readonly<Ref<UseQuickCheckoutState['isOpen']>>;
  timer: Readonly<Ref<UseQuickCheckoutState['timer']>>;
  openQuickCheckout: OpenQuickCheckout;
  closeQuickCheckout: CloseQuickCheckout;
  startTimer: StartTimer;
  endTimer: EndTimer;
}

export type UseQuickCheckoutReturn = () => UseQuickCheckout;
