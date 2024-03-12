import { mount } from '@vue/test-utils';
import Tags from '~/components/ui/Tags/Tags.vue';
import type { Product } from "@plentymarkets/shop-api";

describe('<Tags />', () => {
  it('should render component', () => {
    const wrapper = mount(Tags, {
      props: {
        product: {
          tags: [
            { id: 1, names: { name: 'Tag', lang: 'en' } },
          ]
        } as Product,
      }
    });

    expect(wrapper.getByTestId('tags'));
  });
});