export const useProcessingOrder = () => {
  const state = useState('useProcessingOrder', () => ({
    processingOrder: false,
  }));

  return {
    ...toRefs(state.value),
  };
};
