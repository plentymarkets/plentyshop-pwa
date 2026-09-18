import { mount } from '@vue/test-utils';
import type { Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import DetailsListForm from '../DetailsListForm.vue';
import type { DetailsListItemConfiguration } from '../types';

const buildDetailsListBlock = (uuid: string): Block => ({
  name: 'DetailsList',
  type: 'structure',
  meta: { uuid },
  configuration: { visible: true, layout: { fullWidth: false } },
  content: [
    {
      name: 'TextCard',
      type: 'content',
      meta: { uuid: 'item-1' },
      configuration: { visible: true, detailsSettings: { label: 'Shipping & delivery', defaultOpen: true } },
      content: {},
    },
    {
      name: 'TextCard',
      type: 'content',
      meta: { uuid: 'item-2' },
      configuration: { visible: true },
      content: {},
    },
  ],
});

const mountForm = (uuid: string) => {
  const { restoreBlocks } = useBlocks();
  restoreBlocks({ blocks: [buildDetailsListBlock(uuid)] } as GetBlocksResponse);

  return mount(DetailsListForm, { props: { uuid } });
};

describe('DetailsListForm', () => {
  it('should list configured and fallback item labels in the selected-item dropdown', () => {
    const wrapper = mountForm('details-list-1');

    const options = wrapper.find('[data-testid="details-list-selected-item"]').findAll('option');
    const labels = options.map((option) => option.text());

    expect(labels).toContain('Shipping & delivery');
    expect(labels).toContain('Item 2');
  });

  it('should update the selected item label when edited', async () => {
    const wrapper = mountForm('details-list-2');

    await wrapper.find('[data-testid="details-list-selected-item"]').setValue('item-1');
    await wrapper.find('[data-testid="details-list-item-label"]').setValue('Returns');

    const { allBlocks } = useBlocks();
    const { findOrDeleteBlockByUuid } = useBlockManager();
    const block = findOrDeleteBlockByUuid(allBlocks.value, 'item-1') as Block;

    expect((block.configuration as DetailsListItemConfiguration).detailsSettings?.label).toBe('Returns');
  });

  it('should update the selected item defaultOpen flag when toggled', async () => {
    const wrapper = mountForm('details-list-3');

    await wrapper.find('[data-testid="details-list-selected-item"]').setValue('item-2');
    await wrapper.find('[data-testid="details-list-item-default-open"]').setValue(true);

    const { allBlocks } = useBlocks();
    const { findOrDeleteBlockByUuid } = useBlockManager();
    const block = findOrDeleteBlockByUuid(allBlocks.value, 'item-2') as Block;

    expect((block.configuration as DetailsListItemConfiguration).detailsSettings?.defaultOpen).toBe(true);
  });
});
