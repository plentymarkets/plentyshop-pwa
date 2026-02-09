import type { Block } from '@plentymarkets/shop-api';

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
      console.warn('[useHeader] Returning cached header blocks');
      return headerCache.value;
    }

    console.warn('[useHeader] Cache miss, delegating to global blocks fetch');
    const { fetchGlobalBlocks } = useGlobalBlocks();
    await fetchGlobalBlocks();

    return headerCache.value ?? [];
  };

  return {
    headerCache,
    fetchHeaderBlocks,
    getHeaderBlocks,
    clearHeaderCache,
    updateHeaderCache,
  };
};
