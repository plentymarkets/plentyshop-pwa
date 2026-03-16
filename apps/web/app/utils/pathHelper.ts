export const validateApiUrl = (url: string | undefined): string | undefined => {
  return url?.replace(/[/\\]+$/, '');
};

export const isPageOfType = (type: string): boolean => {
  return useRouter().currentRoute.value.meta.type === type;
};
