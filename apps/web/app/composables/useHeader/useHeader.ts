import type { Block } from '@plentymarkets/shop-api';
import { callWithNuxt } from '#app';

export const useHeader = () => {
  const headerCache = useState<Block[] | null>('header-blocks-cache', () => null);

  const clearHeaderCache = () => {
    headerCache.value = null;
  };

  const updateHeaderCache = (newHeaderBlocks: Block[]) => {
    headerCache.value = newHeaderBlocks;
  };

  const getHeaderBlocks = (): Block[] => {
    return headerCache.value || [];
  };

  const fetchHeaderBlocks = async (): Promise<Block[]> => {
    if (headerCache.value) {
      return headerCache.value;
    }

    const nuxtApp = useNuxtApp();

    return callWithNuxt(nuxtApp, async () => {
      try {
        const { data } = await useAsyncData(`header-blocks-${nuxtApp.$i18n.locale}`, () =>
          useSdk().plentysystems.getBlocks({
            identifier: 'index',
            type: 'immutable',
            blocks: 'Header',
          }),
        );

        const headerBlocks = data.value?.data?.filter((block) => block.name === 'Header') ?? [];

        if (headerBlocks.length > 0) {
          headerCache.value = headerBlocks;
          return headerCache.value;
        }
      } catch (error) {
        console.warn('Failed to fetch header blocks, using empty array:', error);
      }

      headerCache.value = [];
      return headerCache.value;
    });
  };

  return {
    headerCache,
    fetchHeaderBlocks,
    getHeaderBlocks,
    clearHeaderCache,
    updateHeaderCache,
  };
};
