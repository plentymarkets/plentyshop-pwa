import type { ApiError, Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import type { UseBlocksState, UseBlocksReturn } from './types';
import { assembleBlocks } from '~/utils/block-helpers';

declare module '#app' {
  interface NuxtApp {
    _settleTimer?: ReturnType<typeof setTimeout> | null;
  }
}

export const useBlocks: UseBlocksReturn = () => {
  const state = useState<UseBlocksState>(`useBlocks`, () => ({
    data: {} as GetBlocksResponse,
    cleanData: {} as GetBlocksResponse,
    defaultTemplateData: [] as Block[],
    loading: false,
    isSettling: false,
  }));

  /*
   @description Schedule setting up clean data & editor enable reset with a timeout.
   */

  const scheduleCleanDataSync = () => {
    state.value.isSettling = true;
    const nuxtApp = useNuxtApp();
    if (nuxtApp._settleTimer) clearTimeout(nuxtApp._settleTimer);
    nuxtApp._settleTimer = setTimeout(() => {
      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
      const { isEditingEnabled } = useEditor();
      isEditingEnabled.value = false;
      state.value.isSettling = false;
      nuxtApp._settleTimer = null;
    }, 150);
  };

  const headerContainer = computed(() => state.value.data.HeaderContainer);
  const footer = computed(() => state.value.data.Footer);
  const pageBlocks = computed(() => state.value.data.blocks ?? []);
  const allBlocks = computed(() => [
    ...(headerContainer.value ? [headerContainer.value] : []),
    ...pageBlocks.value,
    ...(footer.value ? [footer.value] : []),
  ]);

  const fetchBlocks = async (identifier: string | number, type: string) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();

    const loc = computed(() => $i18n.locale.value);

    const key = `blocks-${loc.value}-${type}-${identifier}`;

    const { data, error } = await useAsyncData(key, () =>
      useSdk().plentysystems.getBlocksWithGlobalBlocks({ identifier, type, enableGlobalBlocks: true }),
    );

    if (error.value) {
      console.warn('Failed to fetch blocks:', error.value.message);
    }

    const allBlocks = assembleBlocks(data.value?.data || ({} as GetBlocksResponse), type, identifier);

    const serialized = JSON.stringify(allBlocks);

    state.value.data = JSON.parse(serialized);
    state.value.cleanData = markRaw(JSON.parse(serialized));
    state.value.loading = false;

    const { isEditingEnabled } = useEditor();
    isEditingEnabled.value = false;

    if (import.meta.client) {
      scheduleCleanDataSync();
    }
  };

  const saveBlocks = async (identifier: string | number, type: string, content: string): Promise<boolean> => {
    try {
      state.value.loading = true;

      const response = await useSdk().plentysystems.doSaveBlocksWithGlobalBlocks({
        identifier,
        entityType: type,
        blocks: content,
        enableGlobalBlocks: true,
      });

      const allBlocks = assembleBlocks(
        (response?.data as unknown as GetBlocksResponse) ?? state.value.data,
        type,
        identifier,
      );
      state.value.data = allBlocks;
      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));

      return true;
    } catch (error) {
      useHandleError(error as ApiError);
      console.error('Error saving blocks:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setupFakeBlocks = (rawBlocks: Block[], type: string = 'immutable', identifier: string | number = 0) => {
    const allBlocks = assembleBlocks(
      {
        HeaderContainer: headerContainer.value,
        blocks: rawBlocks,
        Footer: footer.value,
      } as GetBlocksResponse,
      type,
      identifier,
    );

    state.value.data = allBlocks;
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));
  };

  const updateBlocks = (blocks: Block[]) => {
    state.value.data.blocks = blocks;
  };

  const discardChanges = () => {
    state.value.data = JSON.parse(JSON.stringify(state.value.cleanData));
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  return {
    data: computed(() => state.value.data),
    cleanData: computed(() => state.value.cleanData),
    pageBlocks,
    blocks: pageBlocks,
    allBlocks,
    headerContainer,
    footer,
    loading: computed(() => state.value.loading),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
    fetchBlocks,
    saveBlocks,
    setupFakeBlocks,
    updateBlocks,
    discardChanges,
    setDefaultTemplate,
    isSettling: computed(() => state.value.isSettling),
  };
};
