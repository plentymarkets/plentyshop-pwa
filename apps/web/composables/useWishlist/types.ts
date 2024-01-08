import { Ref } from 'vue';
import type {
  WishlistItem,
  AddWishlistItemParams,
  AddWishlistItemResponse,
  DeleteWishlistItemParams,
} from '@plentymarkets/shop-api';

export interface UseWishlistState {
  data: WishlistItem[];
  loading: boolean;
}

export type FetchWishlist = () => Promise<WishlistItem[]>;
export type AddWishlistItem = (params: AddWishlistItemParams) => Promise<AddWishlistItemResponse>;
export type DeleteWishlistItem = (params: DeleteWishlistItemParams) => Promise<boolean>;
export type IsWishlistItem = (variationId: number) => boolean;
export type InteractWithWishlist = (variationId: number, quantity: number) => Promise<void>;

export interface UseWishlist {
  data: Readonly<Ref<UseWishlistState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchWishlist: FetchWishlist;
  addWishlistItem: AddWishlistItem;
  deleteWishlistItem: DeleteWishlistItem;
  isWishlistItem: IsWishlistItem;
  interactWithWishlist: InteractWithWishlist;
}

export type UseWishlistReturn = () => UseWishlist;
