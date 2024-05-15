export const validateApiUrl = (url: string | undefined): string | undefined => {
  return url?.replace(/[/\\]+$/, '');
};
