import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import type { FilteredPageBlocks } from '~/utils/blocks/types';
import PasteModal from '../PasteModal.vue';

const confirmPaste = vi.fn();
const cancelPaste = vi.fn();
const pendingPaste = ref<FilteredPageBlocks | null>(null);

mockNuxtImport('useBlockClipboard', () => () => ({ pendingPaste, confirmPaste, cancelPaste }));

const block = (name: string) => ({ name, type: 'content', meta: { uuid: name }, content: [] }) as unknown as Block;
const query = (status: string) => document.body.querySelectorAll(`[data-testid="paste-modal-entry-${status}"]`);

describe('TableOfContents PasteModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pendingPaste.value = {
      blocks: [block('TextCard'), block('MultiGrid')],
      entries: [
        { name: 'TextCard', status: 'compatible', skipped: [] },
        { name: 'MultiGrid', status: 'partial', skipped: ['ImageGallery'] },
        { name: 'PriceCard', status: 'incompatible', skipped: ['PriceCard'] },
      ],
    };
  });

  it('should show each copied block with its compatibility status', async () => {
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    expect(query('compatible')).toHaveLength(1);
    expect(query('compatible')[0]?.textContent).toContain('Rich Text');
    expect(query('partial')[0]?.textContent).toContain('Layout');
    expect(query('incompatible')[0]?.textContent).toContain('PriceCard');
    wrapper.unmount();
  });

  it('should underline partly compatible blocks with a tooltip listing what is left out', async () => {
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    const label = query('partial')[0]?.querySelector('span');

    expect(label?.className).toContain('decoration-dotted');
    expect(label?.getAttribute('title')).toBe('ImageGallery');
    expect(query('compatible')[0]?.querySelector('span')?.className).not.toContain('decoration-dotted');
    wrapper.unmount();
  });

  it('should show a single warning callout when only some blocks are compatible', async () => {
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    expect(document.body.querySelectorAll('[data-testid="paste-modal-callout-warning"]')).toHaveLength(1);
    expect(document.body.querySelector('[data-testid="paste-modal-callout-negative"]')).toBeNull();
    wrapper.unmount();
  });

  it('should show an error callout when no copied block is compatible', async () => {
    pendingPaste.value = {
      blocks: [],
      entries: [{ name: 'PriceCard', status: 'incompatible', skipped: ['PriceCard'] }],
    };
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    expect(document.body.querySelector('[data-testid="paste-modal-callout-negative"]')).not.toBeNull();
    expect(document.body.querySelector('[data-testid="paste-modal-callout-warning"]')).toBeNull();
    wrapper.unmount();
  });

  it('should not show a callout when every block is compatible', async () => {
    pendingPaste.value = {
      blocks: [block('TextCard')],
      entries: [{ name: 'TextCard', status: 'compatible', skipped: [] }],
    };
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    expect(document.body.querySelector('[data-testid^="paste-modal-callout"]')).toBeNull();
    wrapper.unmount();
  });

  it('should not list the blocks currently on the page', async () => {
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    expect(document.body.querySelector('[data-testid="paste-modal-replaced"]')).toBeNull();
    wrapper.unmount();
  });

  it('should confirm the paste when the confirm button is clicked', async () => {
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    (document.body.querySelector('[data-testid="paste-modal-confirm"]') as HTMLElement).click();

    expect(confirmPaste).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should disable confirm when no copied block can be used', async () => {
    pendingPaste.value = {
      blocks: [],
      entries: [{ name: 'PriceCard', status: 'incompatible', skipped: ['PriceCard'] }],
    };
    const wrapper = await mountSuspended(PasteModal, { attachTo: document.body });

    const button = document.body.querySelector('[data-testid="paste-modal-confirm"]') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    wrapper.unmount();
  });
});
