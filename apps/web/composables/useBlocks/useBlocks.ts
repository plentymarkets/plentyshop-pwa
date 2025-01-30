import type { UseBlocksReturn, UseBlocksState, Blocks, SetActive } from '~/composables/useBlocks/types';

const blocks = {
  0: {
    type: 'slider',
    data: [
      {
        desktopImage: '',
        tabletImage: '',
        mobileImage: '',
        brightness: '',
        preTitle: '',
        mainTitle: '',
        subTitle: '',
      },
    ],
  },
  1: {
    type: 'recommendedProducts',
    data: {
      heading: '',
      products: [],
    },
  },
};

/**
 * @description Composable for managing site configuration.
 * @returns UseBlocksReturn
 * @example
 * ``` ts
 * const { data, activeId } = useBlocks();
 * ```
 */
export const useBlocks: UseBlocksReturn = () => {
  const state = useState<UseBlocksState>('useBlocks', () => ({
    data: blocks as Blocks,
    loading: false,
    activeId: 1234,
    initialData: {},
  }));

  const setActive: SetActive = (id: number) => {
    state.value.activeId = id;
  };

  return {
    ...toRefs(state.value),
    setActive,
  };
};
