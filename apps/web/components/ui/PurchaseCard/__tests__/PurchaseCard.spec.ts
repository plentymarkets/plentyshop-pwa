import { mount } from '@vue/test-utils';
import { UiPurchaseCard }from '#components';
import type {ReviewAverage, ReviewCounts} from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(UiPurchaseCard, {
      props: {
        product: ProductMock,
        reviewAverage: {} as ReviewCounts
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
