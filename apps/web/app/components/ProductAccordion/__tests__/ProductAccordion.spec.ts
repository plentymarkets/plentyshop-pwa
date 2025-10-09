import { mount } from '@vue/test-utils';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';
import { ProductAccordion } from '#components';

describe('<ProductAccordion />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(ProductAccordion, {
      props: {
        product: ProductMock,
      },
    });
    expect(getByTestId('product-accordion'));
  });
});
