import type {
  GetPropertiesPrice,
  SetProperties,
  UseProductOrderPropertiesReturn,
  UseProductOrderPropertiesState,
} from '~/composables/useProductOrderProperties/types';
import { productPropertyGetters } from '@plentymarkets/shop-api';
import type { ProductProperty, BasketItemOrderParamsProperty, Product } from '@plentymarkets/shop-api';

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

    reader.onerror = function () {
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
};

const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers: number[] = Array.from({ length: byteCharacters.length });
  for (let index = 0; index < byteCharacters.length; index++) {
    byteNumbers[index] = byteCharacters.codePointAt(index) ?? -1;
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

/**
 * @description Composable for helping with product order properties.
 * @returns UseProductOrderPropertiesReturn
 * @example
 * ``` ts
 * const {
 * data, loading, setProperties, getPropertyById, getPropertiesForCart, getPropertiesPrice, uploadFile
 * } = useProductOrderProperties();
 * ```
 */
export const useProductOrderProperties: UseProductOrderPropertiesReturn = () => {
  const state = useState<UseProductOrderPropertiesState>(`useProductOrderProperties`, () => ({
    data: [],
    loading: false,
  }));

  /**
   * @description Function for set properties from a product property array to the state.
   * @param productProperties { ProductProperty[] }
   * @example
   * ``` ts
   * setProperties(productProperties);
   * ```
   */
  const setProperties: SetProperties = (productProperties: ProductProperty[]) => {
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

  /**
   * @description Function for getting a property from the state by id.
   * @param id { number }
   * @return { BasketItemOrderParamsProperty | undefined }
   * @example
   * ``` ts
   * getPropertyById(id);
   * ```
   */
  const getPropertyById = (id: number): BasketItemOrderParamsProperty | undefined => {
    return state.value.data.find((property) => property.property.id === id);
  };

  /**
   * @description Function for getting a properties for the cart.
   * @return { BasketItemOrderParamsProperty[] }
   * @example
   * ``` ts
   * getPropertiesForCart();
   * ```
   */
  const getPropertiesForCart = (): BasketItemOrderParamsProperty[] | undefined => {
    const result = state.value.data.filter((property) => property.property.value !== null);
    return result.length > 0 ? result : undefined;
  };

  /**
   * @description Function for calculate the price of the properties.
   * @param product { Product }
   * @return GetPropertiesPrice
   * @example
   * ``` ts
   * getPropertiesPrice(product);
   * ```
   */
  const getPropertiesPrice: GetPropertiesPrice = (product: Product) => {
    const properties = getPropertiesForCart();
    let price = 0;
    if (properties) {
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
    }
    return price;
  };

  /**
   * @description Function for uploading a file for the order property.
   * @param file { File }
   * @return { Promise<string | null> }
   * @example
   * ``` ts
   * uploadFile(file);
   * ```
   */
  const uploadFile = async (file: File): Promise<string | null> => {
    state.value.loading = true;

    const base64String = await fileToBase64(file);
    if (!base64String) {
      state.value.loading = false;
      return null;
    }

    const { data } = await useAsyncData(() =>
      useSdk().plentysystems.doUploadOrderPropertyFile({
        base64: base64String,
        filename: file.name,
        type: file.type,
      }),
    );

    state.value.loading = false;

    return data.value?.data.data ?? null;
  };

  const downloadFile = async (file: string) => {
    const split = file.split('/');
    const { data } = await useAsyncData(() =>
      useSdk().plentysystems.getOrderPropertyFile({
        hash: split[0] ?? '',
        fileName: split[1] ?? '',
      }),
    );

    if (data.value?.data) {
      const blob = base64ToBlob(data.value.data.data.body, data.value.data.data['content-type']);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }

    state.value.loading = false;
    return null;
  };

  return {
    ...toRefs(state.value),
    setProperties,
    getPropertyById,
    getPropertiesForCart,
    getPropertiesPrice,
    uploadFile,
    downloadFile,
  };
};
