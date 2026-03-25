import type { ItemSearchAutocompleteResult } from '@plentymarkets/shop-api';

const CATEGORY_LIMIT = 5;
const SUGGESTIONS_LIMIT = 5;
const ITEMS_LIMIT = 4;

export const useSearchSuggestions = () => {
  const state = useState('useSearchSuggestions', () => ({
    results: null as ItemSearchAutocompleteResult | null,
    searchTerm: '',
    loading: false,
    currentRequestId: 0,
  }));

  const searchSuggestions = async (text: string) => {
    const requestId = ++state.value.currentRequestId;
    const term = text.trim();

    if (term.length < 2) {
      state.value.results = null;
      return;
    }
    if (state.value.searchTerm === term) {
      return;
    }

    state.value.loading = true;
    const { data } = await useSdk().plentysystems.getItemSearchAutocomplete({
      query: term,
      types: ['suggestion', 'category'],
    });

    if (data && requestId === state.value.currentRequestId) {
      data.categories = data?.categories?.splice(0, CATEGORY_LIMIT) ?? [];
      data.suggestions = data?.suggestions?.splice(0, SUGGESTIONS_LIMIT) ?? [];
      data.items = data?.items?.splice(0, ITEMS_LIMIT) ?? [];
      state.value.searchTerm = term;
      state.value.results = data;
    }

    if (requestId === state.value.currentRequestId) {
      state.value.loading = false;
    }
  };

  return {
    searchSuggestions,
    ...toRefs(state.value),
  };
};
