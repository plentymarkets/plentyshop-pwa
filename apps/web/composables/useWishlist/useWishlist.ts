import type { AddWishlistItemResponse, WishlistItem, WishlistVariation } from '@plentymarkets/shop-api';
import type { AddWishlistItemParams, DeleteWishlistItemParams } from '@plentymarkets/shop-api';
import { wishlistGetters } from '@plentymarkets/shop-api';
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
    wishlistItemIds: [] as WishlistVariation[],
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
  const setWishlistItemIds: SetWishlistItemIds = (wishlistItemIds = []) => {
    state.value.wishlistItemIds = wishlistItemIds;
    console.log(wishlistItemIds);

    if (state.value.data.length > 0) {
      state.value.data = state.value.data.filter((wishListItem: WishlistItem) => {
              return wishlistItemIds.find((wishlistVariation: WishlistVariation) =>
                  wishlistVariation.hasOwnProperty(wishListItem.variation.id));
          });
    }
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

    return await useSdk()
      .plentysystems.getWishlist()
      .then(({ data }) => {
        state.value.data = data ?? state.value.data;
        state.value.loading = false;
        const itemIds = data ?? state.value.wishlistItemIds;
        setWishlistItemIds(itemIds.map((wishlistItem: WishlistItem) => {
            let variationObject = {} as WishlistVariation;
            variationObject[wishlistItem.variation.id.toString()] = wishlistGetters.getFlagCanDirectlyAddToCart(wishlistItem);
            return variationObject;
        }));

        return state.value.data;
      });
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
          let variationObject = {} as WishlistVariation;
          variationObject[data.data.variationId] = data.data.canDirectlyAddToCart;
          state.value.wishlistItemIds.push(variationObject);
        setWishlistItemIds(state.value.wishlistItemIds);
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
        setWishlistItemIds(state.value.wishlistItemIds.filter((wishlistVariation: WishlistVariation) => {
          return !wishlistVariation.hasOwnProperty(params.variationId);
        }));
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
      console.log(state.value.wishlistItemIds);

      const route = useRoute();
      if (route.params.itemId) {
          const { productParams } = createProductParams(route.params);
          console.log(productParams);
          console.log(state.value.wishlistItemIds);

          return !!state.value.wishlistItemIds?.find((wishlistVariation: WishlistVariation) => {
              return wishlistVariation.hasOwnProperty(variationId) && productParams.hasOwnProperty(variationId);
          });
      }

    return false;

  };

  // const isVariation: boolean = (variationId: number) => {
  //
  //
  // }

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
