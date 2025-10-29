import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockCustomerReviewBlock } from './CustomerReview.mock';
import CustomerReview from '../CustomerReview.vue';
import { mockProduct } from '../../ImageGallery/__tests__/ImageGallery.mock';

describe('CustomerReview.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the block component', () => {
    const wrapper = mount(CustomerReview, {
      props: { ...mockCustomerReviewBlock, product: mockProduct },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the block with the correct title and structure', () => {
    const wrapper = mount(CustomerReview, {
      props: { ...mockCustomerReviewBlock, product: mockProduct },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    expect(wrapper.find('[data-testid="reviews-accordion"]').exists()).toBe(true);
    expect(wrapper.find('#customerReviewsClick').text()).toBe('Customer Reviews');
  });

  it('should show "no reviews" message when there are no reviews', () => {
    const wrapper = mount(CustomerReview, {
      props: { ...mockCustomerReviewBlock, product: mockProduct },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    expect(wrapper.find('[data-testid="no-review-text"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="no-review-text"]').text()).toBe('customerReviewsNone');
  });

  it('should render non-collapsible content if collapsible is false', () => {
    const wrapper = mount(CustomerReview, {
      props: {
        ...mockCustomerReviewBlock,
        product: mockProduct,
        content: {
          ...mockCustomerReviewBlock.content,
          layout: { ...mockCustomerReviewBlock.content.layout, collapsible: false },
        },
      },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    expect(wrapper.find('[data-testid="reviews-accordion"]').exists()).toBe(false);
    expect(wrapper.find('#customerReviewsClick').exists()).toBe(true);
  });

  it('renders no title and no accordion if title is empty', () => {
    const wrapper = mount(CustomerReview, {
      props: {
        ...mockCustomerReviewBlock,
        product: mockProduct,
        content: {
          ...mockCustomerReviewBlock.content,
          text: { title: '' },
        },
      },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    expect(wrapper.find('[data-testid="reviews-accordion"]').exists()).toBe(false);
    expect(wrapper.find('#customerReviewsClick').text()).toBe('');
  });

  it('should apply inline styles based on layout padding', () => {
    const wrapper = mount(CustomerReview, {
      props: {
        ...mockCustomerReviewBlock,
        product: mockProduct,

        content: {
          ...mockCustomerReviewBlock.content,
          layout: {
            ...mockCustomerReviewBlock.content.layout,
            paddingTop: 10,
            paddingBottom: 20,
            paddingLeft: 30,
            paddingRight: 40,
          },
        },
      },
      global: {
        stubs: {
          SfLoaderCircular: true,
        },
      },
    });
    const mainDiv = wrapper.find('[data-testid="review-area"]');

    expect(mainDiv.exists()).toBe(true);
    expect(mainDiv.attributes('style')).toContain('padding: 10px 40px 20px 30px;');
  });
});
