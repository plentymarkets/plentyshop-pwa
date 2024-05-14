export const removeTrailingSlash = (url: string | undefined): string => {
  return url?.replace(/[/\\]+$/, '') ?? 'http://localhost:8181';
};
