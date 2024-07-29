import { AddressType } from "@plentymarkets/shop-api";

export const useCheckoutComponent = () => {
    const { onCreate: onShippingCreate, onUpdate: onShippingUpdate, onSet: onSetShipping, clear } = useAddressStore(AddressType.Shipping);
    const { onCreate: onBillingCreate } = useAddressStore(AddressType.Billing);
    
    onNuxtReady( async () => {
        const { fetchServer: fetchShipping } = useFetchAdddress(AddressType.Shipping);
        fetchShipping();
        const { fetchServer: fetchBilling } = useFetchAdddress(AddressType.Billing);
        fetchBilling();
    });

    /* const unsubscribeShippingUpdate = onShippingUpdate((event) => {
        const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
        setCheckoutAddress(event.payload);
    }); */

    onSetShipping((event) => {
        const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
        setCheckoutAddress(event.payload[0], true);
    });
    
    onShippingCreate((event) => {
        const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Shipping);
        setCheckoutAddress(event.payload[0]);
    });

    onBillingCreate((event) => {
        const { set: setCheckoutAddress } = useCheckoutAddress(AddressType.Billing);
        setCheckoutAddress(event.payload[0]);
    });

    onUnmounted(() => {
        clear();
    });
};