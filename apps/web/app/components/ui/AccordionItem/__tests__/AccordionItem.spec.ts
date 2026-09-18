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

  it('should render the chevron after the summary by default', () => {
    const wrapper = mount(UiAccordionItem, {
      props: { summary: 'Title' },
    });

    const summary = wrapper.find('summary');
    const summaryChildren = Array.from(summary.element.children).map((child) => child.tagName);

    expect(summaryChildren).toEqual(['P', 'svg']);
  });

  it('should render the chevron before the summary when iconPosition is "start"', () => {
    const wrapper = mount(UiAccordionItem, {
      props: { summary: 'Title', iconPosition: 'start' },
    });

    const summary = wrapper.find('summary');
    const summaryChildren = Array.from(summary.element.children).map((child) => child.tagName);

    expect(summaryChildren).toEqual(['svg', 'P']);
  });
});
