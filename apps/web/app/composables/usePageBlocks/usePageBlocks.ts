import type { Block } from '@plentymarkets/shop-api';
import type { TextCardContent } from '~/components/blocks/TextCard/types';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import { migrateImageContent } from '~/utils/migrate-image-content';
import { migrateRecommendedContent, type OldContent } from '~/utils/migrate-recommended-content';
import { migrateTextCardContent } from '~/utils/migrate-text-editor';
import { v4 as uuid } from 'uuid';
import { createDefaultFooterSettings } from '~/utils/footerHelper';
import type {
  UsePageBlocksState,
  UsePageBlocksReturn,
  FetchPageBlocks,
  SavePageBlocks,
  UpdateHeader,
  UpdateMain,
  UpdateFooter,
} from './types';

export const usePageBlocks: UsePageBlocksReturn = (identifier?: string, type?: string, locale?: string) => {
  const state = useState<UsePageBlocksState>(`pageBlocks-${identifier}-${type}-${locale}`, () => ({
    header: [],
    main: [],
    footer: [],
    defaultTemplateData: [],
    loading: false,
  }));

  const injectGlobalHeader = async (): Promise<Block[]> => {
    const { headerCache, fetchHeaderBlocks } = useHeader();

    if (!headerCache.value) await fetchHeaderBlocks();

    if (headerCache.value && headerCache.value.length > 0) {
      return headerCache.value;
    }

    const headerBlock: Block = {
      name: 'Header',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: {
        meta: {
          uuid: uuid(),
          isGlobalTemplate: true,
        },
      },
    };

    return [headerBlock];
  };

  const injectGlobalFooter = async (): Promise<Block[]> => {
    const { footerCache, fetchFooterSettings } = useFooter();

    if (!footerCache.value) await fetchFooterSettings();

    const footerContent = footerCache.value || createDefaultFooterSettings();

    const footerBlock: Block = {
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: footerContent,
    };

    return [footerBlock];
  };

  const migrateAllBlocks = (blocks: Block[]) => {
    const config = useRuntimeConfig().public;

    for (const block of blocks) {
      if (block.name === 'Image' && block.content) {
        block.content = migrateImageContent(block.content);
      }

      if (block.name === 'ProductRecommendedProducts' && block.content) {
        block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
      }

      if (block.name === 'TextCard' && block.content) {
        block.content = migrateTextCardContent(
          block.content as Partial<TextCardContent>,
          config.enableRichTextEditorV2,
        );
      }

      if (Array.isArray(block.content)) {
        migrateAllBlocks(block.content);
      }
    }
  };

  const splitBlocksByArea = (blocks: Block[]) => {
    const result = { header: [] as Block[], main: [] as Block[], footer: [] as Block[] };
    const areaMap: Record<string, keyof typeof result> = { Header: 'header', Footer: 'footer' };

    for (const block of blocks) {
      const area = areaMap[block.name] ?? 'main';
      result[area].push(block);
    }

    return result;
  };

  const mergeBlocksFromAreas = (): Block[] => {
    return [...state.value.header, ...state.value.main, ...state.value.footer];
  };

  const fetchPageBlocks: FetchPageBlocks = async (identifier, type) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();

    try {
      const { data, error } = await useAsyncData(`${$i18n.locale.value}-${type}-${identifier}`, () =>
        useSdk().plentysystems.getBlocks({ identifier, type }),
      );

      state.value.loading = false;

      if (error.value) {
        const { send } = useNotification();
        send({ type: 'negative', message: error.value.message });
        return;
      }

      const blocks = data?.value?.data ?? [];
      const blocksToUse = blocks.length ? blocks : state.value.defaultTemplateData;

      if (Array.isArray(blocksToUse)) migrateAllBlocks(blocksToUse);

      const { header, main, footer } = splitBlocksByArea(blocksToUse);

      const finalHeader = header.length > 0 ? header : await injectGlobalHeader();
      const finalFooter = footer.length > 0 ? footer : await injectGlobalFooter();

      state.value.header = finalHeader;
      state.value.main = main;
      state.value.footer = finalFooter;
    } catch (error) {
      state.value.loading = false;
      console.error('Failed to fetch page blocks:', error);
    }
  };

  const savePageBlocks: SavePageBlocks = async (identifier, type) => {
    try {
      state.value.loading = true;

      const allBlocks = mergeBlocksFromAreas();
      const content = JSON.stringify(allBlocks);

      await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      if (content.includes('"name":"Header"') || content.includes('"name":"Footer"')) {
        const { clearGlobalBlocksCache } = useGlobalBlocks();
        const { fetchHeaderBlocks } = useHeader();
        const { fetchFooterSettings } = useFooter();

        clearGlobalBlocksCache();

        try {
          await Promise.all([fetchHeaderBlocks(), fetchFooterSettings()]);
        } catch (error) {
          console.warn('Failed to refresh global blocks after save:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving page blocks:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  const updateHeader: UpdateHeader = (blocks) => {
    state.value.header = blocks;
  };

  const updateMain: UpdateMain = (blocks) => {
    state.value.main = blocks;
  };

  const updateFooter: UpdateFooter = (blocks) => {
    state.value.footer = blocks;
  };

  return {
    header: computed(() => state.value.header),
    main: computed(() => state.value.main),
    footer: computed(() => state.value.footer),
    loading: computed(() => state.value.loading),
    fetchPageBlocks,
    savePageBlocks,
    setDefaultTemplate,
    updateHeader,
    updateMain,
    updateFooter,
  };
};
