import { AddressType } from "@plentymarkets/shop-api";

export const useCheckout2 = () => {
    const billingStore = useAddressStore(AddressType.Billing);
    const shippingStore = useAddressStore(AddressType.Shipping);

    const unsubscribeBillingDelete = billingStore.onDestroy((state) => {
        console.log(state);
    });
};