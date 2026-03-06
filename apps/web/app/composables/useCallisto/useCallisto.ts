export const useCallisto = () => {
  const isEnabled = computed(() => {
    const { getSetting } = useSiteSettings('enableSingleProductUrlScheme');
    return String(getSetting()) === 'true';
  });

  return {
    isEnabled: isEnabled.value,
  };
};
