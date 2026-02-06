import type { PayPalButtonSettings } from '@plentymarkets/shop-api';
import type { PayPalVisibilityLocations } from './types';

export const usePayPalVisibility = (type: string) => {
  const state = useState('usePayPalVisibility-' + type, () => ({
    showOnItemPage: false,
    showOnQuickCheckout: false,
    showOnCartPage: false,
    showOnGuestLoginPage: false,
    showOnCheckoutPage: false,
  }));

  const setState = (settings: PayPalButtonSettings | null) => {
    state.value.showOnItemPage = settings?.positions?.includes('SingleItem.AfterAddToBasket') ?? false;
    state.value.showOnQuickCheckout = settings?.positions?.includes('Basket.ExtendOverlayButtons') ?? false;
    state.value.showOnCartPage = settings?.positions?.includes('Basket.AfterCheckoutButton') ?? false;
    state.value.showOnGuestLoginPage = settings?.positions?.includes('Login.AdditionalContentLoginPage') ?? false;
    state.value.showOnCheckoutPage = !!settings;
  };

  const getVisibility = (key: PayPalVisibilityLocations | undefined) => {
    switch (key) {
      case 'itemPage':
        return state.value.showOnItemPage;
      case 'quickCheckout':
        return state.value.showOnQuickCheckout;
      case 'cartPage':
        return state.value.showOnCartPage;
      case 'guestLoginPage':
        return state.value.showOnGuestLoginPage;
      case 'checkoutPage':
        return state.value.showOnCheckoutPage;
      default:
        return false;
    }
  };

  return {
    ...toRefs(state.value),
    setState,
    getVisibility,
  };
};
