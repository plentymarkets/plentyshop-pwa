import { mount } from '@vue/test-utils';
import DetailsList from '../DetailsList.vue';
import type { DetailsListProps } from '../types';

const buildItem = (uuid: string, configuration: Record<string, unknown> = {}): DetailsListProps['content'][number] => ({
  name: 'TextCard',
  type: 'content',
  meta: { uuid },
  configuration: { visible: true, ...configuration },
  content: {},
});

describe('DetailsList', () => {
  const baseProps: DetailsListProps = {
    name: 'DetailsList',
    type: 'structure',
    meta: { uuid: 'details-list-uuid' },
    content: [],
  };

  it('should render one collapsible per visible item and skip hidden items', () => {
    const wrapper = mount(DetailsList, {
      props: {
        ...baseProps,
        content: [buildItem('item-1'), buildItem('item-2', { visible: false }), buildItem('item-3')],
      },
    });

    expect(wrapper.findAll('[data-testid^="details-list-item-"]')).toHaveLength(2);
  });

  it('should use the configured label when detailsSettings.label is set', () => {
    const wrapper = mount(DetailsList, {
      props: {
        ...baseProps,
        content: [buildItem('item-1', { detailsSettings: { label: 'Shipping & delivery' } })],
      },
    });

    expect(wrapper.text()).toContain('Shipping & delivery');
  });

  it('should fall back to a numbered label when no label is configured', () => {
    const wrapper = mount(DetailsList, {
      props: {
        ...baseProps,
        content: [buildItem('item-1'), buildItem('item-2')],
      },
    });

    expect(wrapper.text()).toContain('Item 1');
    expect(wrapper.text()).toContain('Item 2');
  });

  it('should open only the items configured with defaultOpen and leave the rest closed', () => {
    const wrapper = mount(DetailsList, {
      props: {
        ...baseProps,
        content: [
          buildItem('item-1', { detailsSettings: { defaultOpen: true } }),
          buildItem('item-2', { detailsSettings: { defaultOpen: false } }),
        ],
      },
    });

    const [first, second] = wrapper.findAll('details');
    expect((first!.element as HTMLDetailsElement).open).toBe(true);
    expect((second!.element as HTMLDetailsElement).open).toBe(false);
  });
});
