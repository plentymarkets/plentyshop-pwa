import type { ResolvePreviewStateOptions } from './types';

export const resolvePreviewState = async ({
  cookieValue,
  isPreviewConfig,
  getPreviewValid,
}: ResolvePreviewStateOptions): Promise<boolean> => {
  if (isPreviewConfig) {
    return true;
  }

  if (!cookieValue) {
    return false;
  }

  const data = await getPreviewValid();

  if (data?.valid && data.permission === 'write') {
    return true;
  }

  return false;
};
