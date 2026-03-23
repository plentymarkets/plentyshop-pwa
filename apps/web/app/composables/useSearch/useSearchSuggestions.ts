import type { ItemSearchAutocompleteResult } from '@plentymarkets/shop-api';

const CATEGORY_LIMIT = 5;
const SUGGESTIONS_LIMIT = 5;
const ITEMS_LIMIT = 4;

export const useSearchSuggestions = () => {
  const state = useState('useSearchSuggestions', () => ({
    results: null as ItemSearchAutocompleteResult | null,
    searchTerm: '',
    loading: false,
  }));

  const searchSuggestions = async (text: string) => {
    const term = text.trim();

    if (term.length < 2) {
      state.value.results = null;
      return null;
    }
    if (state.value.searchTerm === term) {
      return state.value.results;
    }

    state.value.loading = true;
    const { data } = await useSdk().plentysystems.getItemSearchAutocomplete({
      query: term,
      types: ['suggestion', 'category'],
    });

    if (data) {
      data.categories = data?.categories?.splice(0, CATEGORY_LIMIT) ?? [];
      data.suggestions = data?.suggestions?.splice(0, SUGGESTIONS_LIMIT) ?? [];
      data.items = data?.items?.splice(0, ITEMS_LIMIT) ?? [];
    }

    state.value.searchTerm = term;
    state.value.results = data;
    state.value.loading = false;
    return data;
  };

  return {
    searchSuggestions,
    ...toRefs(state.value),
  };
};
