import { mount } from '@vue/test-utils';
import { UiReviewStatistics } from '#components';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';

describe('<UiReviewStatistics />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiReviewStatistics, {
      props: {
        product: ProductMock,
      },
    });

    expect(getByTestId('average-section'));
  });
});
