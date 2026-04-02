import type { ItemSearchAutocompleteResult, ItemSearchResult, ItemSearchParams } from '@plentymarkets/shop-api';

export interface UseSearchState {
  data: ItemSearchResult;
  loading: boolean;
  productsPerPage: number;
}

export type GetSearch = (params: ItemSearchParams) => Promise<ItemSearchResult>;
export type SearchByTag = (tagId: string, additionalParams?: ItemSearchParams) => Promise<ItemSearchResult>;

export interface UseSearch {
  data: Readonly<Ref<UseSearchState['data']>>;
  loading: Readonly<Ref<boolean>>;
  productsPerPage: Readonly<Ref<number>>;
  getSearch: GetSearch;
  searchByTag: SearchByTag;
}

export type UseSearchReturn = () => UseSearch;

export interface UseSearchSuggestionsState {
  results: ItemSearchAutocompleteResult | null;
  searchTerm: string;
  loading: boolean;
  currentRequestId: number;
}

export type SearchSuggestions = (text: string) => Promise<void>;
export type ResetSuggestions = () => void;

export interface UseSearchSuggestions {
  results: Readonly<Ref<UseSearchSuggestionsState['results']>>;
  searchTerm: Readonly<Ref<string>>;
  loading: Readonly<Ref<boolean>>;
  searchSuggestions: SearchSuggestions;
  resetSuggestions: ResetSuggestions;
}

export type UseSearchSuggestionsReturn = () => UseSearchSuggestions;
