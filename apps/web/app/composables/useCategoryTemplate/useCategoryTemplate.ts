import type {
  FetchCategoryTemplate,
  UseCategoryTemplateReturn,
  UseCategoryTemplateState,
  GetBlocks,
  SaveBlocks,
} from './types';
import type { Block } from '@plentymarkets/shop-api';

import homepageTemplateDataDe from './homepageTemplateDataDe.json';
import homepageTemplateDataEn from './homepageTemplateDataEn.json';
import categoryTemplateData from './categoryTemplateData.json';
import productTemplateData from './productTemplateData.json';
import { migrateImageContent } from '~/utils/migrate-image-content';
import type { OldContent } from '~/utils/migrate-recommended-content';
import { migrateRecommendedContent } from '~/utils/migrate-recommended-content';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';

const useLocaleSpecificHomepageTemplate = (locale: string) =>
  locale === 'de' ? (homepageTemplateDataDe as Block[]) : (homepageTemplateDataEn as Block[]);

const useProductTemplateData = () => productTemplateData as Block[];

const useCategoryTemplateData = () => categoryTemplateData as Block[];

/**
 * Composable for managing category template data with isolated state per page.
 * 
 * State Management Architecture:
 * - stateMap: Stores isolated states keyed by fetch parameters (locale-type-identifier-blocks)
 * - currentStateKey: Global state key shared across all components, updated when getBlocksServer/getBlocks is called
 * - localStateKey: Local snapshot of state key for this composable instance, prevents seeing state changes during page transitions
 * - hasExplicitState: Tracks if this composable instance has explicitly set state via getBlocksServer/getBlocks
 * 
 * Component Types:
 * - Active components (pages): Call getBlocksServer/getBlocks and set their own localStateKey explicitly
 * - Passive components (forms): Never call getBlocksServer, follow global state via watcher
 * 
 * The watcher only updates passive components that haven't explicitly set their state,
 * allowing forms to access current page data while preventing transition flash.
 */
export const useCategoryTemplate: UseCategoryTemplateReturn = () => {
  const { $i18n } = useNuxtApp();
  
  const stateMap = useState<Record<string, UseCategoryTemplateState>>('useCategoryTemplate-states', () => ({}));
  const currentStateKey = useState<string>('useCategoryTemplate-currentKey', () => '');
  const localStateKey = ref<string>(currentStateKey.value);
  const hasExplicitState = ref<boolean>(false);
  
  watch(currentStateKey, (newKey) => {
    if (!hasExplicitState.value) {
      localStateKey.value = newKey;
    }
  }, { immediate: true });
  
  const getStateKey = (identifier: string | number, type: string, blocks?: string) => {
    return `${$i18n.locale.value}-${type}-${identifier}-${blocks || 'none'}`;
  };
  
  const getOrCreateState = (key: string): UseCategoryTemplateState => {
    stateMap.value[key] ??= {
      data: [],
      cleanData: [],
      categoryTemplateData: null,
      loading: false,
    };
    return stateMap.value[key];
  };
  
  /**
   * Computed proxy to access current state using local snapshot to prevent transition flashing.
   * Falls back to 'default' key for code that doesn't call getBlocksServer first.
   */
  const state = computed(() => {
    const keyToUse = localStateKey.value || currentStateKey.value;
    if (!keyToUse) {
      return getOrCreateState('default');
    }
    return getOrCreateState(keyToUse);
  });

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

  /**
   * Sets up state for active components (pages) by configuring both global and local state keys.
   * 
   * This function marks the composable instance as having explicitly set state,
   * preventing the watcher from overriding the local state key.
   * 
   * @param identifier - The page/entity identifier
   * @param type - The entity type (immutable, category, product)
   * @param blocks - Optional blocks parameter for cache differentiation
   * @returns The current state object for the given parameters
   * 
   * State Keys:
   * - Global (currentStateKey): Allows passive components (forms) to access current page data
   * - Local (localStateKey): Maintains isolated state during page transitions
   */
  const setActiveState = (identifier: string | number, type: string, blocks?: string) => {
    const stateKey = getStateKey(identifier, type, blocks);
    hasExplicitState.value = true;
    currentStateKey.value = stateKey;
    localStateKey.value = stateKey;
    return getOrCreateState(stateKey);
  };

  /**
   * Fetches blocks from the server with SSR support and client-side caching.
   * 
   * Execution Strategy:
   * - Server-side: Executes immediately for SSR
   * - Client-side: Only executes if data is not in cache
   * 
   * @param identifier - The page/entity identifier
   * @param type - The entity type (immutable, category, product)
   * @param blocks - Optional blocks parameter for cache differentiation
   */
  const getBlocksServer: GetBlocks = async (identifier, type, blocks?) => {
    const currentState = setActiveState(identifier, type, blocks);
    currentState.loading = true;

    const { $i18n } = useNuxtApp();
    const { data: productsCatalog } = useProducts();
    const cacheKey = `${$i18n.locale.value}-${type}-${identifier}-${blocks}`;

    const { data, error, execute } = await useAsyncData(
      cacheKey,
      () => useSdk().plentysystems.getBlocks({ identifier, type, blocks }),
      {
        immediate: import.meta.server,
      },
    );

    if (import.meta.client && !data.value) {
      await execute();
    }

    if (error.value) {
      const { send } = useNotification();
      send({ type: 'negative', message: error.value.message });
      return;
    }

    let fetchedBlocks: Block[] = data?.value?.data ?? [];

    if (!fetchedBlocks.length && type === 'immutable') {
      fetchedBlocks = useLocaleSpecificHomepageTemplate($i18n.locale.value);
    }

    if (!fetchedBlocks.length && type === 'category' && productsCatalog.value.category?.type === 'item') {
      fetchedBlocks = useCategoryTemplateData();
    }

    if (!fetchedBlocks.length && type === 'product') {
      fetchedBlocks = useProductTemplateData();
    }

    if (Array.isArray(fetchedBlocks)) {
      migrateAllImageBlocks(fetchedBlocks);
    }

    currentState.data = fetchedBlocks;
    currentState.cleanData = markRaw(JSON.parse(JSON.stringify(fetchedBlocks)));

    await ensureFooterBlock();

    currentState.loading = false;
  };

  /**
   * Fetches blocks from the API without caching, with fallback to default templates.
   * 
   * Fallback Templates:
   * - immutable type: Uses locale-specific homepage template
   * - category type (item): Uses default category template
   * 
   * @param identifier - The page/entity identifier
   * @param type - The entity type (immutable, category, product)
   * @param blocks - Optional blocks parameter for cache differentiation
   */
  const getBlocks: GetBlocks = async (identifier, type, blocks?) => {
    const currentState = setActiveState(identifier, type, blocks);
    currentState.loading = true;

    const { data: productsCatalog } = useProducts();

    const response = await useSdk().plentysystems.getBlocks({ identifier, type, blocks });
    const data = response?.data;

    currentState.loading = false;

    if (!data?.length) {
      currentState.data = data;
    } else if (type === 'immutable') {
      currentState.data = useLocaleSpecificHomepageTemplate($i18n.locale.value);
    } else if (type === 'category' && productsCatalog.value.category?.type === 'item') {
      currentState.data = useCategoryTemplateData();
    }

    if (Array.isArray(currentState.data)) {
      migrateAllImageBlocks(currentState.data);
    }

    currentState.cleanData = markRaw(JSON.parse(JSON.stringify(currentState.data)));
  };
  const updateBlocks: UpdateBlocks = (blocks) => {
    state.value.data = blocks;
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

  /**
   * Saves blocks to the server and updates the clean data snapshot.
   * Also handles footer cache updates if footer blocks are included in the content.
   * 
   * @param identifier - The page/entity identifier
   * @param type - The entity type
   * @param content - The serialized blocks content to save
   */
  const saveBlocks: SaveBlocks = async (identifier: string | number, type: string, content: string) => {
    try {
      const stateKey = getStateKey(identifier, type);
      const currentState = getOrCreateState(stateKey);
      currentState.loading = true;

      await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      currentState.cleanData = markRaw(JSON.parse(JSON.stringify(currentState.data)));

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
    } catch (error) {
      console.error('Error saving blocks:', error);
    } finally {
      const stateKey = getStateKey(identifier, type);
      const currentState = getOrCreateState(stateKey);
      currentState.loading = false;
    }
  };
  
  return {
    fetchCategoryTemplate,
    saveBlocks,
    getBlocks,
    getBlocksServer,
    updateBlocks,
    data: computed(() => state.value.data),
    cleanData: computed(() => state.value.cleanData),
    categoryTemplateData: computed(() => state.value.categoryTemplateData),
    loading: computed(() => state.value.loading),
  };
};
