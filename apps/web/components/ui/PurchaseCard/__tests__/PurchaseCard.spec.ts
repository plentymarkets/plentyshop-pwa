import { mount } from '@vue/test-utils';
import { UiPurchaseCard }from '#components';
import type { ReviewAverage } from '@plentymarkets/shop-api';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(UiPurchaseCard, {
      props: {
        product: ProductMock,
        reviewAverage: {} as ReviewAverage
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
