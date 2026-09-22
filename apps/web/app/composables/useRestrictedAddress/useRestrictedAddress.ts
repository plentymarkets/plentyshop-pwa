export const useRestrictedAddress = () => {
  const route = useRoute();
  const localePath = useLocalizedPath();

  const state = useState('useRestrictedAddress', () => ({
    restrictedAddresses: route.fullPath.includes(localePath(paths.readonlyCheckout)),
  }));

  return {
    ...toRefs(state.value),
  };
};
