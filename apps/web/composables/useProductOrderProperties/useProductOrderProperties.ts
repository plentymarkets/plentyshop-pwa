import {
  GetPropertiesPrice,
  SetProperties,
  UseProductOrderPropertiesReturn,
  UseProductOrderPropertiesState,
} from '~/composables/useProductOrderProperties/types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
import { useSdk } from '~/sdk';
import {UploadFileForOrderPropertyResponse} from "@plentymarkets/shop-api";

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

  const fileToBase64 = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        if (!reader.result) {
          resolve(null);
          return;
        }
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        }
      };

      // eslint-disable-next-line unicorn/prefer-add-event-listener
      reader.onerror = function () {
        resolve(null);
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File): Promise<UploadFileForOrderPropertyResponse | null> => {
    state.value.loading = true;

    const base64String = await fileToBase64(file);
    if (!base64String) {
      state.value.loading = false;
      return null;
    }

    const { data, error  } = await useAsyncData(() =>
      useSdk().plentysystems.doUploadOrderPropertyFile({
        base64: base64String,
        filename: file.name,
        type: file.type,
      }),
    );
    useHandleError(error.value);
    state.value.loading = false;

    return data.value?.data ?? null;
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
