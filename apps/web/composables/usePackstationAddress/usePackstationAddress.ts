import { type Address, type Packstation, AddressType } from '@plentymarkets/shop-api';

export const usePackstationAddress = () => {
  const { send } = useNotification();
  const { $i18n } = useNuxtApp();
  const { data } = usePackstationFinder();

  const state = useState('usePackstationAddress', () => ({
    postNumber: '',
  }));

  const postNumberRequired = computed(() => data.value.preferredProfilesData.postnumberRequired);

  const savePackstationAddress = async (packstation: Packstation) => {
    if ((packstation.location.keyword === 'Packstation' || postNumberRequired.value) && !state.value.postNumber) {
      send({ message: $i18n.t('PreferredDelivery.packstation.postnumberRequired'), type: 'warning' });
      return;
    }

    const { handleCartTotalChanges } = useCartTotalChange();
    const { set: setShippingAddress } = useCheckoutAddress(AddressType.Shipping);
    const { addresses: shippingAddresses } = useAddressStore(AddressType.Shipping);
    const { addressToSave, save, refreshAddressDependencies } = useAddressForm(AddressType.Shipping);

    addressToSave.value = shippingAddresses.value[0] as Address;
    delete addressToSave.value?.id;
    addressToSave.value.primary = true;
    addressToSave.value.country = '1';
    addressToSave.value.city = packstation.place.address.addressLocality;
    addressToSave.value.zipCode = packstation.place.address.postalCode;
    addressToSave.value.streetName = packstation.location.keyword;
    addressToSave.value.apartment = packstation.location.keywordId;

    const handleShippingPrimaryAddress = async () => {
      if (shippingAddresses.value.length > 0) {
        await setShippingAddress(shippingAddresses.value[0] as Address);

        usePrimaryAddress(AddressType.Shipping).primaryAddressId.value =
          shippingAddresses.value?.find((item) => item.primary === true)?.id || -1;
      }

      send({ message: $i18n.t('PreferredDelivery.packstation.packstationAddedSuccessMessage'), type: 'positive' });
    };

    save()
      .then(() => handleShippingPrimaryAddress())
      .then(() => refreshAddressDependencies())
      .then(() => handleCartTotalChanges())
      .catch((error) => useHandleError(error));
  };

  return {
    savePackstationAddress,
    ...toRefs(state.value),
  };
};
