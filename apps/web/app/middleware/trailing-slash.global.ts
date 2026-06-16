export default defineNuxtRouteMiddleware((to) => {
  const { resolvePathTrailingSlash } = useUrlTrailingSlash();
  const normalizedPath = resolvePathTrailingSlash(to.path);

  if (normalizedPath === to.path || to.name === 'error') {
    return;
  }

  return navigateTo(
    {
      path: normalizedPath,
      query: to.query,
      hash: to.hash,
    },
    {
      redirectCode: import.meta.server ? 301 : undefined,
    },
  );
});
