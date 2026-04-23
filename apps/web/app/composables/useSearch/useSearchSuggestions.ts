import type { ApiError, ItemSearchAutocompleteResult } from '@plentymarkets/shop-api';
import type { UseSearchSuggestionsReturn, UseSearchSuggestionsState } from './types';

const CATEGORY_LIMIT = 5;
const SUGGESTIONS_LIMIT = 5;
const ITEMS_LIMIT = 4;

export const useSearchSuggestions: UseSearchSuggestionsReturn = () => {
  const state = useState<UseSearchSuggestionsState>('useSearchSuggestions', () => ({
    results: null as ItemSearchAutocompleteResult | null,
    searchTerm: '',
    loading: false,
    currentRequestId: 0,
  }));

  const searchSuggestions = async (text: string) => {
    const term = text.trim().slice(0, 80);

    if (term.length < 2) {
      state.value.currentRequestId++;
      state.value.results = null;
      state.value.loading = false;
      return;
    }

    if (state.value.searchTerm === term) return;

    const requestId = ++state.value.currentRequestId;
    state.value.loading = true;
    try {
      const { data } = await useSdk().plentysystems.getItemSearchAutocomplete({
        query: term,
        types: ['suggestion', 'category'],
      });

      if (data && requestId === state.value.currentRequestId) {
        data.categories = data?.categories?.splice(0, CATEGORY_LIMIT) ?? [];
        data.suggestions = data?.suggestions?.splice(0, SUGGESTIONS_LIMIT) ?? [];
        data.items = data?.items?.splice(0, ITEMS_LIMIT) ?? [];
        state.value.searchTerm = term;
        state.value.results = data as unknown as ItemSearchAutocompleteResult;
      }
    } catch (error) {
      useHandleError(error as ApiError);
    } finally {
      if (requestId === state.value.currentRequestId) state.value.loading = false;
    }
  };

  const resetSuggestions = () => {
    state.value.currentRequestId++;
    state.value.results = null;
    state.value.searchTerm = '';
    state.value.loading = false;
  };

  return {
    results: toRef(state.value, 'results'),
    searchTerm: toRef(state.value, 'searchTerm'),
    loading: toRef(state.value, 'loading'),
    searchSuggestions,
    resetSuggestions,
  };
};
