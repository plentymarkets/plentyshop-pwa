export const useLocalizedPath = () => {
  const rawLocalePath = useLocalePath();
  const { resolvePathTrailingSlash } = useUrlTrailingSlash();

  return (path: string) => resolvePathTrailingSlash(rawLocalePath(path));
};
