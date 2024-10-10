import type { AddWishlistItemResponse, WishlistItem, WishlistVariation } from '@plentymarkets/shop-api';
import type { AddWishlistItemParams, DeleteWishlistItemParams } from '@plentymarkets/shop-api';
import { wishlistGetters } from '@plentymarkets/shop-api';
import type {
  FetchWishlist,
  UseWishlistReturn,
  UseWishlistState,
  DeleteWishlistItem,
  AddWishlistItem,
  InteractWithWishlist,
  SetWishlistItemIds,
} from '~/composables/useWishlist/types';

/**
 * @description Composable for managing wishlist.
 * @returns UseWishlistReturn
 * @example
 * ``` ts
 * const {
 *  data, loading, fetchWishlist, addWishlistItem, deleteWishlistItem, isWishlistItem, interactWithWishlist
 *  wishlistItemIds, setWishlistItemIds } = useWishlist();
 * ```
 */
export const useWishlist: UseWishlistReturn = () => {
  const state = useState<UseWishlistState>('wishlist', () => ({
    data: [] as WishlistItem[],
    loading: false,
    wishlistItemIds: {} as WishlistVariation,
  }));

  /**
   * @description Function for setting the wishlist item ids.
   * @return SetWishlistItemIds
   * @example
   * ``` ts
   *  setWishlistItemIds([{'1006': 0}, {'1065': 1}]);
   * ```
   * @param wishlistItemIds
   */
  const setWishlistItemIds: SetWishlistItemIds = (wishlistItemIds: WishlistVariation = {}) => {
    state.value.wishlistItemIds = wishlistItemIds;
  };

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

    try {
      const { data } = await useSdk().plentysystems.getWishlist();

      state.value.data = data ?? [];

      const wishlistItemIds: WishlistVariation = {};

      state.value.data.forEach((wishlistItem: WishlistItem) => {
        const variationId = wishlistItem.variation.id.toString();
        wishlistItemIds[variationId] = wishlistGetters.getCanDirectlyAddToCart(wishlistItem);
      });

      setWishlistItemIds(wishlistItemIds);

      return state.value.data;
    } finally {
      state.value.loading = false;
    }
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

    try {
      const { data } = await useSdk().plentysystems.doAddWishlistItem(params);

      state.value.wishlistItemIds[data.data.variationId] = data.data.canDirectlyAddToCart;
      setWishlistItemIds(state.value.wishlistItemIds);

      return data || ({} as AddWishlistItemResponse);
    } finally {
      state.value.loading = false;
    }
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

    try {
      const { data } = await useSdk().plentysystems.deleteWishlistItem(params);

      const variationKey = params.variationId.toString();

      if (state.value.wishlistItemIds && variationKey in state.value.wishlistItemIds) {
        state.value.data = state.value.data.filter((item) => item.variation.id !== params.variationId);
        delete state.value.wishlistItemIds[variationKey];
      }

      setWishlistItemIds(state.value.wishlistItemIds || {});

      return data;
    } finally {
      state.value.loading = false;
    }
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
  const isWishlistItem = (variationId: number) => {
    const route = useRoute();
    const { itemId } = route.params || {};
    const isProductPage = Boolean(itemId);
    let isOverviewPage = true;
    let currentVariationId: string | number | undefined;

    if (isProductPage) {
      const { productParams } = createProductParams(route.params);
      currentVariationId = Number(productParams.variationId);
      isOverviewPage = !currentVariationId;
    }

    const wishlistItems = state.value.wishlistItemIds || {};

    if (!(variationId in wishlistItems)) {
      return false;
    }

    const canDirectlyAddToCart = Number(wishlistItems[variationId]);

    return isOverviewPage
      ? canDirectlyAddToCart === 0
      : currentVariationId === variationId && canDirectlyAddToCart === 1;
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
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();

    await (isWishlistItem(variationId)
      ? deleteWishlistItem({ variationId }).then(() =>
          send({ type: 'positive', message: $i18n.t('wishlistInteraction.delete') }),
        )
      : addWishlistItem({ variationId, quantity }).then(() =>
          send({ type: 'positive', message: $i18n.t('wishlistInteraction.add') }),
        ));
  };

  return {
    fetchWishlist,
    addWishlistItem,
    setWishlistItemIds,
    deleteWishlistItem,
    isWishlistItem,
    interactWithWishlist,
    ...toRefs(state.value),
  };
};
