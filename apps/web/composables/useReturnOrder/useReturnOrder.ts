import { toRefs } from '@vueuse/shared';
import { SetCurrentReturnOrder, UseReturnOrderReturn, UseReturnOrderState } from './types';
import type { Order } from '@plentymarkets/shop-api';
import { orderGetters } from '@plentymarkets/shop-sdk';

/**
 * @description Composable for setting additional information.
 * @returns DoAdditionalInformationReturn
 * @example
 * ``` ts
 * const {
 * data, loading, shippingPrivacyAgreement, setShippingPrivacyAgreement, doAdditionalInformation
 * } = useAdditionalInformation();
 * ```
 */
export const useReturnOrder: UseReturnOrderReturn = () => {
  const state = useState<UseReturnOrderState>(`useReturnOrder`, () => ({
    data: null,
    loading: false,
    currentReturnOrder: {} as Order,
    // TODO: tie this to the order
    returnData: {
      variationIds: {},
      returnNote: '',
    },
  }));

  /**
   * @description Function for setting the additional information.
   * @example
   * ``` ts
   * doAdditionalInformation({
   *   orderContactWish: null,
   *   orderCustomerSign: null,
   *   shippingPrivacyHintAccepted: true,
   *   templateType: 'checkout'
   * });
   * ```
   */
  const setCurrentReturnOrder: SetCurrentReturnOrder = (order: Order) => {
    state.value.currentReturnOrder = order;
  };

  const updateReturnDataItems = (variationId, quantity) => {
    state.value.returnData['variationIds'][variationId] = quantity;
  };

  const selectAll = () => {
    const orderItems = orderGetters.getItems(state.value.currentReturnOrder);

    orderItems.forEach((item) => {
      updateReturnDataItems(orderGetters.getItemVariationId(item), orderGetters.getItemQty(item));
    });

    console.log('state.value.returnData:', state.value.returnData);
  };

  return {
    setCurrentReturnOrder,
    updateReturnDataItems,
    selectAll,
    ...toRefs(state.value),
  };
};
