export const useShippingAsBilling = () => {
  const state = useState('useShippingAsBilling', () => ({
    shippingAsBilling: false,
  }));

  return {
    ...toRefs(state.value),
  };
};
