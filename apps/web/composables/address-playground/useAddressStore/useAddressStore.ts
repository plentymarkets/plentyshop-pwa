import { type Address, AddressType, shippingProviderGetters } from '@plentymarkets/shop-api';
import { type AddressState } from './types';

export const useAddressStore = (type: AddressType) => {
  const { selectedMethod, getShippingMethods } = useCartShippingMethods();
  const { fetchPaymentMethods } = usePaymentMethods();
  const { data: customerData, getSession } = useCustomer();
  const { data: cartData } = useCart();
  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const state = useState<AddressState>('useAddressStore' + type, () => ({
    addresses: [],
  }));

  const set = (addresses: Address[]) => {
    state.value.addresses = addresses;
  };

  const create = (address: Address) => {
    state.value.addresses.push(address);
  };

  const get = (addressId: number) => {
    return state.value.addresses.find((address: Address) => address.id === addressId);
  };

  const update = (address: Address) => {
    const index = state.value.addresses.findIndex((a: Address) => a.id === address.id);
    if (index !== -1) state.value.addresses[index] = address;
  };

  const destroy = (addressId: number) => {
    state.value.addresses = state.value.addresses.filter((address: Address) => address.id !== addressId);
  };

  const clear = () => set([]);

  const notifyIfShippingChanged = () => {
    if (
      selectedMethod.value &&
      shippingProviderGetters.getShippingProfileId(cartData.value).toString() !==
        shippingProviderGetters.getParcelServicePresetId(selectedMethod.value)
    ) {
      send({ message: $i18n.t('shipping.methodChanged'), type: 'warning' });
    }
  };

  const notifyIfBillingChanged = () => {
    if (cartData.value.methodOfPaymentId !== customerData.value.basket.methodOfPaymentId) {
      send({ message: $i18n.t('billing.methodChanged'), type: 'warning' });
      cartData.value.methodOfPaymentId = customerData.value.basket.methodOfPaymentId;
    }
  };

  const refreshAddressDependencies = async () => {
    if (type === AddressType.Shipping) {
      await Promise.all([getSession(), getShippingMethods(), fetchPaymentMethods()]);
      notifyIfShippingChanged();
      notifyIfBillingChanged();
    }
  };

  return {
    ...toRefs(state.value),
    set,
    create,
    get,
    update,
    destroy,
    clear,
    refreshAddressDependencies,
  };
};
