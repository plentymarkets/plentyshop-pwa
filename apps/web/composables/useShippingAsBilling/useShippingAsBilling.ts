export const useShippingAsBilling = () => {
  const state = useState('useShippingAsBilling', () => ({
    disabled: false,
    shippingAsBilling: false,
  }));

  return {
    ...toRefs(state.value),
  };
};
