import { type Address, AddressType, cartGetters, userAddressGetters } from '@plentymarkets/shop-api';
import type {
  DeleteAddress,
  SetDefault,
  UseAddressReturn,
  GetAddresses,
  SaveAddress,
  UseAddressMethodsState,
} from './types';

/**
 * @deprecated use `useAddressStore`, `useCheckoutAddress`, `useCreateAddress`, `usePrimaryAddress`, `useFetchAddress`, `useDeleteAddress` instead
 * @description Composable for working with addresses in the current user session.
 * The composable covers two types of addresses, billing and shipping.
 * @example
 * This example uses the address type `Billing`. All examples are equivalent for addresses of type `Shipping`.
 * ``` ts
 * const {
 *  data,
 *  loading,
 *  defaultAddressId,
 *  savedAddress,
 *  getAddresses,
 *  saveAddress,
 *  deleteAddress,
 *  setDefault
 * } = useAddress(AddressType.Billing);
 * let address: Address;
 * let id: Number;
 * getAddresses();
 * saveAddress(address);
 * deleteAddress(id);
 * setDefault(id);
 * ```
 * - `getAddresses` gets all addresses of the address type passed to `useAddress`.
 * Updates `defaultAddressId` to the current default address.
 * - `saveAddress` saves the given address with the address type passed to `useAddress`.
 * If successful, it returns the `savedAddress`.
 * After saving the address, updates the list of addresses.
 * - `deleteAddress` deletes the address of the address type passed to `useAddress` with the given ID.
 * After deleting the address, updates the list of addresses.
 * - `setDefault` updates the `defaultAddressId` of the type passed to `useAddress` with the given ID.
 * After setting the default, updates the list of addresses.
 * @param type
 */

export const useAddress: UseAddressReturn = (type: AddressType, cacheKey = '') => {
  const state = useState<UseAddressMethodsState>(`useAddress-${type}${cacheKey}`, () => ({
    data: [] as Address[],
    useAsShippingAddress: true,
    loading: false,
    defaultAddressId: 0,
    defaultAddress: {} as Address,
    cartAddressId: 0,
    cartAddress: {} as Address,
    displayAddress: {} as Address,
  }));

  const { data: cart } = useCart();

  watch(cart, () => {
    const billingId = cartGetters.getCustomerInvoiceAddressId(cart.value);
    const shippingId = cartGetters.getCustomerShippingAddressId(cart.value);

    state.value.useAsShippingAddress = billingId === shippingId;
  });

  const hasDisplayAddress = computed(() => {
    return Boolean(state.value?.displayAddress?.id);
  });

  const setCheckoutAddress = async (typeId: AddressType, addressId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.setCheckoutAddress({
      typeId: typeId,
      addressId: addressId,
    });
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
      useSdk().plentysystems.setCheckoutAddress({ typeId: type, addressId: Number(address.id) });
    }
  };

  const setCartAddress = () => {
    const { data: cart } = useCart();
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
    const { data, error } = await useAsyncData(type.toString(), () =>
      useSdk().plentysystems.getAddresses({
        typeId: type,
      }),
    );
    useHandleError(error.value);
    state.value.data = data.value?.data ?? state.value.data;

    setInitialDisplayAddress();

    state.value.loading = false;
    return state.value.data;
  };

  const saveAddress: SaveAddress = async (address: Address, combineShippingBilling = false) => {
    state.value.loading = true;

    const { data, error } = await useAsyncData(type.toString(), () =>
      useSdk().plentysystems.doSaveAddress({
        typeId: type,
        addressData: address,
      }),
    );

    useHandleError(error.value);
    state.value.loading = false;

    const createdAddress = data.value?.data[0];

    if (createdAddress) {
      setDisplayAddress(createdAddress);
      if (combineShippingBilling) {
        await setCheckoutAddress(AddressType.Billing, Number(userAddressGetters.getId(createdAddress)));
      }
    }

    state.value.data = data.value?.data ?? state.value.data;

    return state.value.data ?? [];
  };

  const setDefault: SetDefault = async (address: Address) => {
    state.value.loading = true;
    await useSdk().plentysystems.doSaveAddress({
      typeId: type,
      addressData: address,
    });

    state.value.loading = false;
    state.value.defaultAddressId = Number(userAddressGetters.getId(address));
    setDisplayAddress(address);
  };

  const deleteAddress: DeleteAddress = async (addressId: number) => {
    state.value.loading = true;
    const { data } = await useSdk().plentysystems.deleteAddress({
      typeId: type,
      addressId: addressId,
    });

    state.value.loading = false;
    state.value.data = data;

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
