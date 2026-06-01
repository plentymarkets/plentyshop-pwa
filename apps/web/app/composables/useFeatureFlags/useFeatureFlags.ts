export const useFeatureFlags = () => {
  const { data, error, status } = useFetch<Record<string, unknown>>('/api/feature-flags');

  return {
    flags: data,
    error,
    loading: computed(() => status.value === 'pending'),
  };
};
