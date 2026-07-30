export const useCallisto = () => {
  const isEnabled = computed(() => {
    const { getBooleanSetting } = useSiteSettings('enableSingleProductUrlScheme');
    return getBooleanSetting();
  });

  return {
    isEnabled: isEnabled.value,
  };
};
