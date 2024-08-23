import { mount } from '@vue/test-utils';
import { UiReview } from '#components';
import { mockProductReviewItems } from '~/composables/useProductReviews/__tests__/productReviewItems.mock';

describe('<Review />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiReview, {
      props: {
        reviewItem: mockProductReviewItems[0],
      },
    });

    expect(getByTestId('review-item'));
  });
});
