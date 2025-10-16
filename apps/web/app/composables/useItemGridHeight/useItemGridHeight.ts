export const useItemGridHeight = (uuid: string) => {
  const itemGridHeight = useState<number>(`itemGridHeight-${uuid}`, () => 0);

  const setItemGridHeight = (height: number) => {
    itemGridHeight.value = height;
  };

  return {
    itemGridHeight,
    setItemGridHeight,
  };
};
