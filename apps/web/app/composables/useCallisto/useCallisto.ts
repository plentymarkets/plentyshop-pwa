export const useCallisto = () => {
  const isEnabled = computed(() => {
    const { getSetting } = useSiteSettings('enableCallistoUrlScheme');
    return String(getSetting()) === 'true';
  });

  return {
    isEnabled: isEnabled.value,
  };
};
