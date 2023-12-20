import {
  GetPropertiesPrice,
  SetProperties,
  UseProductOrderPropertiesReturn,
  UseProductOrderPropertiesState,
} from '~/composables/useProductOrderProperties/types';
import { productPropertyGetters } from '@plentymarkets/shop-sdk';

export const useProductOrderProperties: UseProductOrderPropertiesReturn = () => {
  const state = useState<UseProductOrderPropertiesState>(`useProductOrderProperties`, () => ({
    data: [],
  }));

  const setProperties: SetProperties = (productProperties) => {
    state.value.data = [];
    productProperties.forEach((property) => {
      if (property.property.isOderProperty) {
        state.value.data.push({
          property: {
            id: property.property.id,
            names: {
              name: property.property.names.name,
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

  return {
    ...toRefs(state.value),
    setProperties,
    getPropertyById,
    getPropertiesForCart,
    getPropertiesPrice,
  };
};
