import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { Block } from '@plentymarkets/shop-api';

import { migrateImageContent } from '~/utils/migrate-image-content';
import type { OldContent } from '~/utils/migrate-recommended-content';
import { migrateRecommendedContent } from '~/utils/migrate-recommended-content';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';

export const useCategoryTemplate: UseCategoryTemplateReturn = (
  identifier: string = 'unknown',
  type: string = 'unknown',
  locale: string = 'locale',
  blocks: string = 'all',
) => {
  const state = useState<UseCategoryTemplateState>(
    `useCategoryTemplate-${identifier}-${type}-${locale}-${blocks}`,
    () => ({
      data: [],
      cleanData: [],
      categoryTemplateData: null,
      defaultTemplateData: [],
      loading: false,
    }),
  );

  const ensureFooterBlock = async () => {
    const { fetchFooterSettings } = useFooter();

    try {
      await fetchFooterSettings();
    } catch (error) {
      console.warn('Failed to ensure footer block:', error);
    }
  };

  const migrateAllImageBlocks = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.name === 'Image' && block.content) {
        block.content = migrateImageContent(block.content);
      }
      if (block.name === 'ProductRecommendedProducts' && block.content) {
        block.content = migrateRecommendedContent(block.content as OldContent | ProductRecommendedProductsContent);
      }
      if (Array.isArray(block.content)) {
        migrateAllImageBlocks(block.content);
      }
    }
  };

  const ensureHomeReviewsPlacement = (topLevelBlocks: Block[]) => {
    // Only affect the homepage. Keep it deterministic and avoid duplicates.
    if (identifier !== 'index') return;
    if (!Array.isArray(topLevelBlocks) || topLevelBlocks.length === 0) return;
    if (topLevelBlocks.some((b) => b?.name === 'HomeReviews')) return;

    const logoSliderIndex = topLevelBlocks.findIndex((b) => b?.name === 'LogoSlider');
    if (logoSliderIndex === -1) return;

    const isThreeImagesBlock = (b: Block | undefined) => {
      if (!b || b.name !== 'MultiGrid' || !Array.isArray(b.content)) return false;
      const imageCount = b.content.filter((child) => child?.name === 'Image').length;
      return imageCount >= 3;
    };

    let insertAt = logoSliderIndex;
    for (let i = logoSliderIndex - 1; i >= 0; i -= 1) {
      if (isThreeImagesBlock(topLevelBlocks[i])) {
        insertAt = i;
        break;
      }
    }

    const reviewsBlock: Block = {
      name: 'HomeReviews',
      type: 'content',
      meta: {
        // Static UUID so we don't create needless diffs in editor state.
        uuid: 'f8e1d2c3-b4a5-4f6e-9d8c-7b6a5c4d3e2f',
        isGlobalTemplate: false,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: {} as any,
    };

    topLevelBlocks.splice(insertAt, 0, reviewsBlock);
  };

  const getBlocksServer: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();

    const { data, error } = await useAsyncData(`${$i18n.locale.value}-${type}-${identifier}-${blocks}`, () =>
      useSdk().plentysystems.getBlocks({ identifier, type, blocks }),
    );

    state.value.loading = false;

    if (error.value) {
      const { send } = useNotification();
      send({ type: 'negative', message: error.value.message });
      return;
    }

    setupBlocks(data?.value?.data ?? []);

    await ensureFooterBlock();
  };

  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    state.value.loading = true;

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, blocks });
    const data = response?.data;

    state.value.loading = false;

    setupBlocks(data ?? []);
  };

  const setupBlocks = (fetchedBlocks: Block[]) => {
    const blocks = fetchedBlocks.length ? fetchedBlocks : state.value.defaultTemplateData;

    if (Array.isArray(blocks)) {
      ensureHomeReviewsPlacement(blocks);
      migrateAllImageBlocks(blocks);
    }

    if (JSON.stringify(state.value.data) !== JSON.stringify(blocks)) {
      state.value.data.splice(0, state.value.data.length, ...blocks);
    }
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(blocks)));
  };

  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  /**
   * @description Function for fetching the category template from a category id
   * @param categoryId
   * @return CategoryTemplate
   * @example
   * ``` ts
   * fetchCategoryTemplate({
   *    id: 16
   * })
   * ```
   */
  const fetchCategoryTemplate: FetchCategoryTemplate = async (categoryId) => {
    const { data } = await useAsyncData(`fetchCategoryTemplate-${categoryId}`, () =>
      useSdk().plentysystems.getCategoryTemplate({ id: categoryId }),
    );

    state.value.categoryTemplateData = data?.value?.data ?? state.value.categoryTemplateData;
  };

  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      state.value.loading = true;

      await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));

      if (typeof content === 'string' && content.includes('"name":"Footer"')) {
        const { updateFooterCache, extractFooterFromBlocks, clearFooterCache, fetchFooterSettings } = useFooter();

        const footerSettings = extractFooterFromBlocks(content);
        if (footerSettings) {
          updateFooterCache(footerSettings);
        } else {
          clearFooterCache();
          try {
            await fetchFooterSettings();
          } catch (error) {
            console.warn('Failed to refresh footer settings after save:', error);
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error saving blocks:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };
  return {
    fetchCategoryTemplate,
    saveBlocks,
    getBlocks,
    getBlocksServer,
    updateBlocks,
    setupBlocks,
    setDefaultTemplate,
    ...toRefs(state.value),
  };
};
