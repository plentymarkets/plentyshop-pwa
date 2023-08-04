import { mount } from '@vue/test-utils';
import PurchaseCard from '~/components/ui/PurchaseCard/PurchaseCard.vue';
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
import { ReviewAverage } from '@plentymarkets/plentymarkets-sdk/packages/api-client/server';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(PurchaseCard, {
      props: {
        product: {} as Product,
        reviewAverage: {} as ReviewAverage
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
