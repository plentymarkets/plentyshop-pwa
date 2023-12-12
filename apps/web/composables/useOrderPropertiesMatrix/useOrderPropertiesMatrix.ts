import { MatrixContext } from './MatrixContext';
import { orderPropertiesStrategies } from './types';
import { ProductPropertyDetails } from '@plentymarkets/shop-api/lib/types/api/product';

export const useOrderPropertiesMatrix = () => {
  const testingContext = () => {
    const page = 'product';
    const orderProperty: ProductPropertyDetails = {
      id: 12,
      position: 0,
      valueType: 'empty',
      isOderProperty: true,
      isShownAsAdditionalCosts: false,
      isRequired: false,
      isPreSelected: false,
      isShownOnItemPage: true,
      isShownOnItemList: true,
      isShownAtCheckout: true,
      surcharge: 0,
      vatId: null,
      names: {
        lang: 'en',
        name: 'Checkbox auto prop',
        description: '',
        propertyId: '12',
      },
      selectionValues: [],
      value: true,
    };

    const orderPropertyType = 'checkbox';

    const matrixContext = new MatrixContext(orderPropertiesStrategies[orderPropertyType]);
    return matrixContext.getPropertyState(page, orderProperty);
  };

  return {
    testingContext,
  };
};
