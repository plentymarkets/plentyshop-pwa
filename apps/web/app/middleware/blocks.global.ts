export default defineNuxtRouteMiddleware(async (to) => {
  const { meta } = to;
  const hasBlockIdentifier = meta.isBlockified && meta.identifier !== undefined;
  const identifier = (hasBlockIdentifier ? meta.identifier : 'index') as string | number;
  const type = (hasBlockIdentifier && meta.type ? meta.type : 'immutable') as string;

  const { fetchBlocks } = useBlocks();

  await fetchBlocks(identifier, type);
});
