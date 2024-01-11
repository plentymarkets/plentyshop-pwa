import { mount } from '@vue/test-utils';
import PurchaseCard from '~/components/ui/PurchaseCard/PurchaseCard.vue';
import { ReviewAverage } from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(PurchaseCard, {
      props: {
        product: ProductMock,
        reviewAverage: {} as ReviewAverage
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
