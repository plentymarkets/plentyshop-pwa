import type {
  WishlistItem,
  AddWishlistItemParams,
  AddWishlistItemResponse,
  DeleteWishlistItemParams,
} from '@plentymarkets/shop-api';

export interface UseWishlistState {
  data: WishlistItem[];
  loading: boolean;
  wishlistItemIds: number[];
}

export type FetchWishlist = () => Promise<WishlistItem[]>;
export type AddWishlistItem = (params: AddWishlistItemParams) => Promise<AddWishlistItemResponse>;
export type DeleteWishlistItem = (params: DeleteWishlistItemParams) => Promise<boolean>;
export type IsWishlistItem = (variationId: number) => boolean;
export type InteractWithWishlist = (variationId: number, quantity: number) => Promise<void>;
export type SetWishlistItemIds = (wishlistItemIds: number[]) => void;

export interface UseWishlist {
  data: Readonly<Ref<UseWishlistState['data']>>;
  wishlistItemIds: Readonly<Ref<UseWishlistState['wishlistItemIds']>>;
  loading: Readonly<Ref<boolean>>;
  fetchWishlist: FetchWishlist;
  addWishlistItem: AddWishlistItem;
  deleteWishlistItem: DeleteWishlistItem;
  isWishlistItem: IsWishlistItem;
  setWishlistItemIds: SetWishlistItemIds;
  interactWithWishlist: InteractWithWishlist;
}

export type UseWishlistReturn = () => UseWishlist;
