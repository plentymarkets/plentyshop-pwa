import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useBlockClipboard } from '../useBlockClipboard';

const send = vi.fn();
const updateBlocks = vi.fn();
const isEditingEnabled = ref(false);
const pageBlocks = ref<Block[]>([]);

mockNuxtImport('useBlocks', () => () => ({ pageBlocks, updateBlocks }));
mockNuxtImport('useEditor', () => () => ({ isEditingEnabled }));
const blocksLists = ref({
  'item-page': {
    accessControl: ['product'],
    variations: [{ template: { en: { name: 'PriceCard' } } }],
  },
});
const blocksListContext = ref('productCategory');
mockNuxtImport('useBlocksList', () => () => ({ blocksLists, blocksListContext, getBlocksLists: vi.fn() }));
mockNuxtImport('getBlockLoader', () => () => ({}));
mockNuxtImport('useNotification', () => () => ({ send }));

const block = (name: string, uuid: string) =>
  ({ name, type: 'content', meta: { uuid }, content: [] }) as unknown as Block;

describe('useBlockClipboard', () => {
  const writeText = vi.fn();
  const readText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useState('useBlockClipboard').value = null;
    isEditingEnabled.value = false;
    pageBlocks.value = [block('HeaderContainer', 'h'), block('Banner', 'a')];
    vi.stubGlobal('navigator', { clipboard: { writeText, readText } });
  });

  it('should copy page blocks without header and footer to the clipboard', async () => {
    const { copyPageBlocks } = useBlockClipboard();

    await copyPageBlocks();

    const written = JSON.parse(writeText.mock.calls[0]?.[0]);
    expect(written.blocks.map((b: Block) => b.name)).toEqual(['Banner']);
  });

  it('should expose only usable blocks as pending paste without changing the page', async () => {
    readText.mockResolvedValue(
      JSON.stringify({
        kind: 'plentyshop-page-template',
        version: 1,
        blocks: [block('PriceCard', 'p'), block('Banner', 'b')],
      }),
    );
    const { requestPaste, pendingPaste } = useBlockClipboard();

    await requestPaste();

    expect(pendingPaste.value?.blocks.map((b) => b.name)).toEqual(['Banner']);
    expect(pendingPaste.value?.entries.flatMap((entry) => entry.skipped)).toEqual(['PriceCard']);
    expect(updateBlocks).not.toHaveBeenCalled();
  });

  it('should replace page blocks with new uuids and enable editing when confirming', async () => {
    const { copyPageBlocks, requestPaste, confirmPaste, pendingPaste } = useBlockClipboard();
    await copyPageBlocks();
    readText.mockResolvedValue(writeText.mock.calls[0]?.[0]);
    await requestPaste();

    confirmPaste();

    const pasted = updateBlocks.mock.calls[0]?.[0] as Block[];
    expect(pasted[0]?.meta.uuid).not.toBe('a');
    expect(isEditingEnabled.value).toBe(true);
    expect(pendingPaste.value).toBeNull();
  });

  it('should not change the page when the paste is cancelled', async () => {
    readText.mockResolvedValue(
      JSON.stringify({ kind: 'plentyshop-page-template', version: 1, blocks: [block('Banner', 'b')] }),
    );
    const { requestPaste, cancelPaste, confirmPaste, pendingPaste } = useBlockClipboard();
    await requestPaste();

    cancelPaste();
    confirmPaste();

    expect(pendingPaste.value).toBeNull();
    expect(updateBlocks).not.toHaveBeenCalled();
  });

  it('should notify and not set a pending paste when the clipboard has no template', async () => {
    readText.mockResolvedValue('hello');
    const { requestPaste, pendingPaste } = useBlockClipboard();

    const result = await requestPaste();

    expect(result).toBe(false);
    expect(pendingPaste.value).toBeNull();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
  });

  it('should notify instead of checking blocks when the page type is unknown', async () => {
    blocksListContext.value = '';
    readText.mockResolvedValue(
      JSON.stringify({ kind: 'plentyshop-page-template', version: 1, blocks: [block('PriceCard', 'p')] }),
    );
    const { requestPaste, pendingPaste } = useBlockClipboard();

    const result = await requestPaste();

    expect(result).toBe(false);
    expect(pendingPaste.value).toBeNull();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    blocksListContext.value = 'productCategory';
  });

  it('should notify when clipboard access is denied', async () => {
    readText.mockRejectedValue(new Error('denied'));
    const { requestPaste, pendingPaste } = useBlockClipboard();

    await requestPaste();

    expect(pendingPaste.value).toBeNull();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
  });
});
