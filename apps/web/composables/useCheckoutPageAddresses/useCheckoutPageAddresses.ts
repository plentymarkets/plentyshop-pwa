// import { AddressType } from '@plentymarkets/shop-api';

// export const useCheckoutPageAddresses = () => {
//   const { get: getShipping } = useAddressStore(AddressType.Shipping);
//   const { get: getBilling } = useAddressStore(AddressType.Billing);
//   const { data: cart } = useCart();

//   onNuxtReady(async () => {
//     useFetchAdddress(AddressType.Shipping).fetchServer();
//     useFetchAdddress(AddressType.Billing).fetchServer();
//   });

// onSetShipping((event) => {
//   const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
//   const cartShippingAddressId = cartGetters.getCustomerShippingAddressId(cart.value);
//   const primaryAddress = userAddressGetters.getDefault(event.payload);

//   if (event.payload[0]) {
//     const cartAddress = ref();

//     if (cartShippingAddressId) cartAddress.value = getShipping(cartShippingAddressId);

//     cartAddress.value
//       ? setCheckoutAddress(cartAddress.value, true)
//       : setCheckoutAddress(primaryAddress ?? event.payload[0]);
//   }
// });

// onSetBilling((event) => {
//   const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
//   const cartBillingAddressId = cartGetters.getCustomerInvoiceAddressId(cart.value);
//   const primaryAddress = userAddressGetters.getDefault(event.payload);

//   if (event.payload[0]) {
//     const cartAddress = ref();

//     if (cartBillingAddressId) cartAddress.value = getBilling(cartBillingAddressId);

//     cartAddress.value
//       ? setCheckoutAddress(cartAddress.value, true)
//       : setCheckoutAddress(primaryAddress ?? event.payload[0]);
//   }
// });

// onShippingCreate((event) => {
//   const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
//   setCheckoutAddress(event.payload[0]);
// });

// onBillingCreate((event) => {
//   const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
//   setCheckoutAddress(event.payload[0]);
// });
// };
