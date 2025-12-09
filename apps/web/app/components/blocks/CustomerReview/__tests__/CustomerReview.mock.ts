import type { CustomerReviewProps } from '../types';

export const customerReviewBlockUuid = '45454545-4545-4455-8455-454545454545';

/**
 * Mock CustomerReview block for testing
 * Fully typed with CustomerReviewProps for type safety
 */
export const mockCustomerReviewBlock: CustomerReviewProps = {
  name: 'CustomerReview',
  type: 'content',
  meta: { uuid: customerReviewBlockUuid },
  content: {
    text: {
      title: 'Customer Reviews',
    },
    layout: {
      collapsible: true,
      initiallyCollapsed: true,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
