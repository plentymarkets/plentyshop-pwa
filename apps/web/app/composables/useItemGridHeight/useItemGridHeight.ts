import type { UseItemGridHeightReturn } from './types';

export const useItemGridHeight: UseItemGridHeightReturn = (uuid) => {
  const itemGridHeight = useState<number>(`itemGridHeight-${uuid}`, () => 0);

  const setItemGridHeight = (height: number) => {
    itemGridHeight.value = height;
  };

  return {
    itemGridHeight,
    setItemGridHeight,
  };
};