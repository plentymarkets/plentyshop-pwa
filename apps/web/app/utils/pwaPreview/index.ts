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

  const response = await getPreviewValid();
  console.log('getPreviewValid response:', response);

  return Boolean(response?.data?.valid && response.data.permission === 'write');
};
