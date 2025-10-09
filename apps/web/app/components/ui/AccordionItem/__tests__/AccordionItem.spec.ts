import { mount } from '@vue/test-utils';
import { UiAccordionItem } from '#components';

describe('<AccordionItem />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(UiAccordionItem, {
      props: {
        breadcrumbs: [],
      },
    });

    expect(getByTestId('accordion-item'));
  });
});
