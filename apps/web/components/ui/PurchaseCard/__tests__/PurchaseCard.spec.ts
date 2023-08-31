import { mount } from '@vue/test-utils';
import PurchaseCard from '~/components/ui/PurchaseCard/PurchaseCard.vue';
import type { Product } from '@plentymarkets/shop-api';
import { ReviewAverage } from '@plentymarkets/shop-api';

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
