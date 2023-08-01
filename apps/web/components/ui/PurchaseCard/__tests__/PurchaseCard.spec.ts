import { mount } from '@vue/test-utils';
import PurchaseCard from '~/components/ui/PurchaseCard/PurchaseCard.vue';
import type { ProductItemDocumentData } from '../../@plentymarkets/plentymarkets-sdk/packages/api-client';

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(PurchaseCard, {
      props: {
        product: {} as ProductItemDocumentData,
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });
});
