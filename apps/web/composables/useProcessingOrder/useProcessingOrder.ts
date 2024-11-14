export const useProcessingOrder = () => {
  const state = useState('useProcessingOrder', () => ({
    processingOrder: false,
  }));

  const start = () => {
    state.value.processingOrder = true;
  };

  const stop = () => {
    state.value.processingOrder = false;
  };

  return {
    start,
    stop,
    ...toRefs(state.value),
  };
};
