import { v4 as uuid } from 'uuid';
import type { Block } from '@plentymarkets/shop-api';
import { createDefaultFooterSettings } from '~/utils/footerHelper';
import type { FooterSettings } from '~/components/blocks/Footer/types';

export const useGlobalBlocks = () => {
  const globalBlocksCache = useState<Block[] | null>('global-blocks-cache', () => null);
  const isFetching = useState<boolean>('global-blocks-fetching', () => false);

  const fetchGlobalBlocks = async (): Promise<void> => {
    if (isFetching.value) return;
    if (globalBlocksCache.value) return;

    isFetching.value = true;

    try {
      const { $i18n } = useNuxtApp();
      const { data } = await useAsyncData(`global-blocks-${$i18n.locale.value}`, () =>
        useSdk().plentysystems.getBlocks({ identifier: 'index', type: 'immutable' }),
      );

      const allBlocks = data.value?.data ?? [];
      globalBlocksCache.value = allBlocks;

      const { updateFooterCache } = useFooter();
      const footerBlock = allBlocks.find((block) => block.name === 'Footer');
      if (footerBlock) updateFooterCache((footerBlock.content as FooterSettings) ?? createDefaultFooterSettings());
    } catch (error) {
      console.error('Failed to fetch global blocks:', error);
      globalBlocksCache.value = [];
    } finally {
      isFetching.value = false;
    }
  };

  const injectGlobalHeader = async (blocks: Block[]): Promise<Block[]> => {
    const hasHeader = blocks.some((block) => block.name === 'Header');
    if (hasHeader) return blocks;
    if (!globalBlocksCache.value) await fetchGlobalBlocks();

    const headerBlocks = globalBlocksCache.value?.filter((block) => block.name === 'Header') ?? [];
    const clonedHeaderBlocks = headerBlocks.length > 0 ? JSON.parse(JSON.stringify(headerBlocks)) : [];
    if (clonedHeaderBlocks.length > 0) return [...clonedHeaderBlocks, ...blocks];

    return blocks;
  };

  const injectGlobalFooter = async (blocks: Block[]): Promise<Block[]> => {
    const hasFooter = blocks.some((block) => block.name === 'Footer');
    if (hasFooter) return blocks;

    const { footerCache, fetchFooterSettings } = useFooter();
    if (!footerCache.value) await fetchFooterSettings();

    const footerContent = footerCache.value || createDefaultFooterSettings();
    const footerBlock: Block = {
      name: 'Footer',
      type: 'content',
      meta: { uuid: uuid(), isGlobalTemplate: true },
      content: footerContent,
    };

    return [...blocks, footerBlock];
  };

  const ensureAllGlobalBlocks = async (blocks: Block[]): Promise<Block[]> => {
    let result = await injectGlobalHeader(blocks);
    result = await injectGlobalFooter(result);

    return result;
  };

  const updateGlobalBlocks = (newBlocks: Block[]) => {
    if (!globalBlocksCache.value) return;
    globalBlocksCache.value.splice(0, globalBlocksCache.value.length, ...newBlocks);
  };

  return {
    fetchGlobalBlocks,
    ensureAllGlobalBlocks,
    updateGlobalBlocks,
    globalBlocksCache: readonly(globalBlocksCache),
  };
};
