import { mount } from '@vue/test-utils';
import type { ItemSearchAutocompleteItem } from '@plentymarkets/shop-api';
import { UiSearchSuggestionProduct } from '#components';

describe('<SearchSuggestionProduct />', () => {
  it('should use the secondary color for the product price', () => {
    const wrapper = mount(UiSearchSuggestionProduct, {
      props: {
        item: {
          image: '',
          imageAlt: '',
          label: 'Test product',
          price: 10,
          url: '/test-product',
        } as ItemSearchAutocompleteItem,
      },
      global: {
        stubs: {
          NuxtImg: true,
          NuxtLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.get('[data-testid="search-suggestion-product-price"]').classes()).toContain('text-secondary-600');
  });
});
