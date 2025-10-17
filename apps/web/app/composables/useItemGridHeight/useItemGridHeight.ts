export const useItemGridHeight = () => {
  const itemGridHeight = useState<number>('itemGridHeight', () => 0);

  const setItemGridHeight = (height: number) => {
    itemGridHeight.value = height;
  };

  return {
    itemGridHeight,
    setItemGridHeight,
  };
};
