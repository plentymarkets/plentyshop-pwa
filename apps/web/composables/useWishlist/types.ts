import type {
  WishlistItem,
  AddWishlistItemParams,
  AddWishlistItemResponse,
  DeleteWishlistItemParams,
} from '@plentymarkets/shop-api';
import {WishlistVariation} from "../../../../../plentymarkets-sdk/packages/api-client/src/types/api/wishlist";

export interface UseWishlistState {
  data: WishlistItem[];
  loading: boolean;
  wishlistItemIds: string[];
  wishlistVariationIds: WishlistVariation[]
}

export type FetchWishlist = () => Promise<WishlistItem[]>;
export type AddWishlistItem = (params: AddWishlistItemParams) => Promise<AddWishlistItemResponse>;
export type DeleteWishlistItem = (params: DeleteWishlistItemParams) => Promise<boolean>;
export type IsWishlistItem = (variationId: number) => boolean;
export type InteractWithWishlist = (variationId: number, quantity: number) => Promise<void>;
export type SetWishlistItemIds = (wishlistItemIds: string[]) => void;
export type IsWishlistItemMainVariation = (variationId: number) => boolean;
export type SetWishlistVariationIds = (wishlistItems: any[]) => void;

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
  isWishlistItemMainVariation: IsWishlistItemMainVariation;
  setWishlistVariationIds: SetWishlistVariationIds;
}

export type UseWishlistReturn = () => UseWishlist;
