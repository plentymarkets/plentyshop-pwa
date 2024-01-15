import { AddWishlistItemResponse, WishlistItem } from '@plentymarkets/shop-api';
import type { AddWishlistItemParams, DeleteWishlistItemParams } from '@plentymarkets/shop-api';

import { toRefs } from '@vueuse/shared';
import {
  FetchWishlist,
  UseWishlistReturn,
  UseWishlistState,
  DeleteWishlistItem,
  AddWishlistItem,
  IsWishlistItem,
  InteractWithWishlist,
} from '~/composables/useWishlist/types';

/**
 * @description Composable for managing wishlist.
 * @returns UseWishlistReturn
 * @example
 * ``` ts
 * const {
 *  data, loading, fetchWishlist, addWishlistItem, deleteWishlistItem, isWishlistItem, interactWithWishlist
 * } = useWishlist();
 * ```
 */
export const useWishlist: UseWishlistReturn = () => {
  const state = useState<UseWishlistState>('wishlist', () => ({
    data: [] as WishlistItem[],
    loading: false,
  }));

  /**
   * @description Function for fetching products.
   * @return FetchWishlist
   * @example
   * ``` ts
   *  fetchWishlist();
   * ```
   */
  const fetchWishlist: FetchWishlist = async () => {
    state.value.loading = true;
    const { data } = await useAsyncData(() => useSdk().plentysystems.getWishlist());

    state.value.data = data.value?.data ?? state.value.data;

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for adding an item to the wishlist.
   * @param params { AddWishlistItemParams }
   * @return AddWishlistItemResponse
   * @example
   * ``` ts
   *  addWishlistItem({
   *    variationId: 1,
   *    quantity: 1
   *  })
   * ```
   */
  const addWishlistItem: AddWishlistItem = async (params: AddWishlistItemParams) => {
    state.value.loading = true;

    const { data } = await useAsyncData(() => useSdk().plentysystems.doAddWishlistItem(params));

    state.value.loading = false;
    return data.value?.data || ({} as AddWishlistItemResponse);
  };

  /**
   * @description Function for deleting an item from the wishlist.
   * @param params { DeleteWishlistItemParams }
   * @return DeleteWishlistItem
   * @example
   * ``` ts
   *  deleteWishlistItem({
   *    variationId: 1
   *  })
   * ```
   */
  const deleteWishlistItem: DeleteWishlistItem = async (params: DeleteWishlistItemParams) => {
    state.value.loading = true;

    const { data } = await useAsyncData(() => useSdk().plentysystems.deleteWishlistItem(params));

    state.value.loading = false;
    return !!data.value?.data;
  };

  /**
   * @description Function for determining whether an item is in wishlist.
   * @param variationId
   * @return IsWishlistItem
   * @example
   * ``` ts
   *  isWishlistItem({
   *    variationId: 1
   *  })
   * ```
   */
  const isWishlistItem: IsWishlistItem = (variationId: number) => {
    return !!state.value?.data?.find((item: WishlistItem) => variationId === item.variation.id);
  };

  /**
   * @description Function for determining whether an item should be added or deleted from the wishlist.
   * @param variationId
   * @param quantity
   * @return InteractWithWishlist
   * @example
   * ``` ts
   *  interactWithWishlist({
   *    variationId: 1,
   *    quantity: 1,
   *  })
   * ```
   */
  const interactWithWishlist: InteractWithWishlist = async (variationId: number, quantity = 1) => {
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    if (isWishlistItem(variationId)) {
      await deleteWishlistItem({ variationId });

      send({
        type: 'positive',
        message: $i18n.t('wishlistInteraction.delete'),
      });
    } else {
      await addWishlistItem({ variationId, quantity });

      send({
        type: 'positive',
        message: $i18n.t('wishlistInteraction.add'),
      });
    }

    await fetchWishlist();
  };

  return {
    fetchWishlist,
    addWishlistItem,
    deleteWishlistItem,
    isWishlistItem,
    interactWithWishlist,
    ...toRefs(state.value),
  };
};
