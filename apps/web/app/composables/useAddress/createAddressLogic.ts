import { computed, toRefs, watch, type Ref } from 'vue';
import { type Address, AddressType, type ApiError, cartGetters, userAddressGetters } from '@plentymarkets/shop-api';
import type { DeleteAddress, GetAddresses, SaveAddress, SetDefault, UseAddressDeps, UseAddressMethodsState } from './types';

export const createAddressLogic = (type: AddressType, state: Ref<UseAddressMethodsState>, deps: UseAddressDeps) => {
  const { sdk, cart, handleError } = deps;

  watch(cart, () => {
    const billingId = cartGetters.getCustomerInvoiceAddressId(cart.value);
    const shippingId = cartGetters.getCustomerShippingAddressId(cart.value);
    state.value.useAsShippingAddress = billingId === shippingId;
  });

  const hasDisplayAddress = computed(() => Boolean(state.value?.displayAddress?.id));

  const setCheckoutAddress = async (typeId: AddressType, addressId: number) => {
    state.value.loading = true;
    await sdk.plentysystems.setCheckoutAddress({ typeId, addressId });
    state.value.loading = false;
  };

  const setDefaultAddress = () => {
    const addresses = state.value.data;
    const defaultAddress = userAddressGetters.getDefault(addresses) || userAddressGetters.getAddresses(addresses)[0];
    if (defaultAddress) {
      state.value.defaultAddress = defaultAddress;
      state.value.defaultAddressId = Number(userAddressGetters.getId(defaultAddress));
    }
  };

  const setDisplayAddress = (address: Address, setAsCheckoutAddress = false): void => {
    state.value.displayAddress = address;
    if (setAsCheckoutAddress) {
      sdk.plentysystems.setCheckoutAddress({ typeId: type, addressId: Number(address.id) });
    }
  };

  const setCartAddress = () => {
    const addressCartId =
      type === AddressType.Billing
        ? cartGetters.getCustomerInvoiceAddressId(cart.value)
        : cartGetters.getCustomerShippingAddressId(cart.value);

    if (addressCartId) {
      state.value.cartAddressId = addressCartId;
      const cartAddress = state.value.data.find(
        (address: Address) => Number(userAddressGetters.getId(address)) === addressCartId,
      );
      if (cartAddress) state.value.cartAddress = cartAddress;
    }
  };

  const setInitialDisplayAddress = (): void => {
    if (hasDisplayAddress.value) return;

    state.value.loading = true;

    if (state.value.data.length > 0) {
      setDefaultAddress();
      setCartAddress();

      if (state.value.cartAddressId) {
        setDisplayAddress(state.value.cartAddress);
      } else {
        if (state.value.defaultAddressId) setDisplayAddress(state.value.defaultAddress, true);
      }
    }

    state.value.loading = false;
  };

  const getAddresses: GetAddresses = async () => {
    state.value.loading = true;
    try {
      const { data } = await sdk.plentysystems.getAddresses({ typeId: type });
      state.value.data = data ?? state.value.data;
    } catch (error) {
      handleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    setInitialDisplayAddress();
    return state.value.data;
  };

  const saveAddress: SaveAddress = async (address: Address, combineShippingBilling = false) => {
    try {
      state.value.loading = true;
      const { data } = await sdk.plentysystems.doSaveAddress({ typeId: type, addressData: address });

      if (data && data.length > 0 && data[0]) {
        const createdAddress = data[0];
        setDisplayAddress(createdAddress);
        if (combineShippingBilling) {
          await setCheckoutAddress(AddressType.Billing, Number(userAddressGetters.getId(createdAddress)));
        }
      }

      state.value.data = data ?? state.value.data;
    } catch (error) {
      handleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return state.value.data ?? [];
  };

  const setDefault: SetDefault = async (address: Address) => {
    state.value.loading = true;
    await sdk.plentysystems.doSaveAddress({ typeId: type, addressData: address });
    state.value.loading = false;
    state.value.defaultAddressId = Number(userAddressGetters.getId(address));
    setDisplayAddress(address);
  };

  const deleteAddress: DeleteAddress = async (addressId: number) => {
    state.value.loading = true;
    const { data } = await sdk.plentysystems.deleteAddress({ typeId: type, addressId });
    state.value.loading = false;
    state.value.data = data ?? state.value.data;
    return state.value.data;
  };

  return {
    setDisplayAddress,
    getAddresses,
    saveAddress,
    setDefault,
    deleteAddress,
    setCheckoutAddress,
    hasDisplayAddress,
    ...toRefs(state.value),
  };
};
