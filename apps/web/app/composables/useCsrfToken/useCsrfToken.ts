export const useCsrfToken = () => {
  const state = useState(`useCsrfToken`, () => ({
    token: '',
  }));

  return {
    ...toRefs(state.value),
  };
};
