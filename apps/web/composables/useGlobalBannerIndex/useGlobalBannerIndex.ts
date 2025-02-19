const globalIndex = ref();

export const useGlobalBannerIndex = () => {
  const setIndex = (newIndex: number) => {
    globalIndex.value = newIndex;
  };
  return {
    globalIndex,
    setIndex,
  };
};
