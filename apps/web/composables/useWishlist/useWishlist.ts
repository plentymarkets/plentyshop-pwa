import type {
  AddWishlistItemResponse,
  WishlistItem,
  AddWishlistItemParams,
  DeleteWishlistItemParams,
} from '@plentymarkets/shop-api';
import type {
  FetchWishlist,
  UseWishlistReturn,
  UseWishlistState,
  DeleteWishlistItem,
  AddWishlistItem,
  IsWishlistItem,
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
    wishlistItemIds: [] as string[],
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

    return await useSdk()
      .plentysystems.getWishlist()
      .then(({ data }) => {
        state.value.data = data ?? state.value.data;
        state.value.loading = false;
        return state.value.data;
      });
  };

  /**
   * @description Function for setting the wishlist item ids.
   * @return SetWishlistItemIds
   * @example
   * ``` ts
   *  setWishlistItemIds(['1', '2']);
   * ```
   * @param wishlistItemIds
   */
  const setWishlistItemIds: SetWishlistItemIds = (wishlistItemIds = []) => {
    state.value.wishlistItemIds = wishlistItemIds.map((number) => number.toString());

    if (state.value.data.length > 0) {
      state.value.data = state.value.data.filter((wishListItem) =>
        state.value.wishlistItemIds.includes(wishListItem.variation.id.toString()),
      );
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

    return await useSdk()
      .plentysystems.doAddWishlistItem(params)
      .then(({ data }) => {
        setWishlistItemIds([...state.value.wishlistItemIds, params.variationId.toString()]);
        state.value.loading = false;
        return data || ({} as AddWishlistItemResponse);
      });
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

    return await useSdk()
      .plentysystems.deleteWishlistItem(params)
      .then(({ data }) => {
        setWishlistItemIds(state.value.wishlistItemIds.filter((id: string) => id !== params.variationId.toString()));
        state.value.loading = false;
        return !!data;
      });
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
    return !!state.value.wishlistItemIds?.find((item: string) => variationId.toString() === item);
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
