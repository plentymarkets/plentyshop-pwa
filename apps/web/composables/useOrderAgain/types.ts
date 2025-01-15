import type { Order } from '@plentymarkets/shop-api';

export interface UseOrderAgainState {
  loading: boolean;
  order: Order | null;
  isOpen: boolean;
  hasItemsChanged: boolean;
}

export type OpenOrderAgainModal = (order: Order) => Promise<void>;
export type LoadOrderInformation = (orderId: string, accessKey: string) => Promise<void>;
export type AddOrderToCart = () => Promise<boolean>;

export interface UseOrderAgain {
  order: Readonly<Ref<UseOrderAgainState['order']>>;
  hasItemsChanged: Readonly<Ref<UseOrderAgainState['hasItemsChanged']>>;
  loading: Ref<boolean>;
  isOpen: Ref<boolean>;
  openOrderAgainModal: OpenOrderAgainModal;
  loadOrderInformation: LoadOrderInformation;
  addOrderToCart: AddOrderToCart;
}

export type UseOrderAgainReturn = () => UseOrderAgain;
