import { ref } from 'vue';
import { useHandleError, usePlentyEvent, useSdk } from '#imports';
import type { ApiError } from '@plentymarkets/shop-api';
import extensionConfig from '../extension.config';

const DEFAULT_QUANTITY = 1;

/**
 * State and submit logic of the SKU quick order form.
 * The extension talks to the backend through the SDK and informs the shop about the changed cart
 * through the shop-core event bus. Errors (unknown SKU, out of stock, ...) are shown as notifications.
 */
export function useSkuToCart() {
  const { emit } = usePlentyEvent();
  const sku = ref('');
  const quantity = ref(DEFAULT_QUANTITY);
  // The quantity selector keeps its own count, so changing the key resets it to the default.
  const formKey = ref(0);
  const loading = ref(false);

  const setQuantity = (value: number) => {
    quantity.value = value;
  };

  const submit = async () => {
    const requestedSku = sku.value.trim();
    if (!extensionConfig.isActive() || !requestedSku || loading.value) {
      return false;
    }

    loading.value = true;

    try {
      const { data: cart } = await useSdk().plentysystems.doAddCartItemBySku({
        sku: requestedSku,
        quantity: quantity.value,
      });
      const { items = [] } = cart;

      const item = items.find(
        (cartItem) => cartItem.variation?.variation?.number?.toLowerCase() === requestedSku.toLowerCase(),
      );
      if (item) {
        emit('frontend:addToCart', {
          item,
          cart,
          addItemParams: { productId: item.variationId, quantity: quantity.value },
        });
      }

      sku.value = '';
      quantity.value = DEFAULT_QUANTITY;
      formKey.value++;

      return true;
    } catch (error) {
      useHandleError(error as ApiError);

      return false;
    } finally {
      loading.value = false;
    }
  };

  return { sku, quantity, formKey, loading, setQuantity, submit };
}
