import { mount } from '@vue/test-utils';
import PurchaseCard from '~/components/ui/PurchaseCard/PurchaseCard.vue';
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(PurchaseCard, {
      props: {
        product: {} as Product,
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
