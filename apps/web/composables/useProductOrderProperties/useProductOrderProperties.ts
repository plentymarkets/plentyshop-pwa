import {
  GetPropertiesPrice,
  SetProperties,
  UseProductOrderPropertiesReturn,
  UseProductOrderPropertiesState,
} from '~/composables/useProductOrderProperties/types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import {useSdk} from "~/sdk";

export const useProductOrderProperties: UseProductOrderPropertiesReturn = () => {
  const state = useState<UseProductOrderPropertiesState>(`useProductOrderProperties`, () => ({
    data: [],
    loading: false,
  }));

  const setProperties: SetProperties = (productProperties) => {
    state.value.data = [];
    productProperties.forEach((property) => {
      if (productPropertyGetters.isOrderProperty(property)) {
        state.value.data.push({
          property: {
            id: productPropertyGetters.getOrderPropertyId(property),
            names: {
              name: productPropertyGetters.getOrderPropertyName(property),
            },
            valueType: property.property.valueType,
            value: null,
          },
        });
      }
    });
  };

  const getPropertyById = (id: number) => {
    return state.value.data.find((property) => property.property.id === id);
  };

  const getPropertiesForCart = () => {
    return state.value.data.filter((property) => property.property.value !== null);
  };

  const getPropertiesPrice: GetPropertiesPrice = (product) => {
    const properties = getPropertiesForCart();
    let price = 0;
    properties.forEach((property) => {
      const propertyItem = product.properties?.find(
        (productProperty) => productProperty.propertyId === property.property.id,
      );
      if (propertyItem) {
        const labels = productPropertyGetters.getOrderPropertyLabel(propertyItem);
        if (labels.surchargeType === 'incl') {
          price += productPropertyGetters.getOrderPropertySurcharge(propertyItem);
        }
      }
    });
    return price;
  };

  const uploadFile = async (file: File) => {
    const runTimeConfig = useRuntimeConfig();
    state.value.loading = true;

    const formData = new FormData();
    formData.append('fileData', file);

    console.log([...formData.entries()]);
    console.log('formData', JSON.stringify(Object.fromEntries(formData)));
    const response = await useAsyncData(() => useSdk().plentysystems.doUploadOrderPropertyFile(formData));
    /**
    const response = await useAsyncData(() =>
      fetch('https://xwelm96ydnar.c14-01.plentymarkets.com/rest/io/order/property/file', {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      }),
    ); */
    console.log(response);
    state.value.loading = false;
  };

  return {
    ...toRefs(state.value),
    setProperties,
    getPropertyById,
    getPropertiesForCart,
    getPropertiesPrice,
    uploadFile,
  };
};
