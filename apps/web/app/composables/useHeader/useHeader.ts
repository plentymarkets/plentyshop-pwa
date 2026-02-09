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
