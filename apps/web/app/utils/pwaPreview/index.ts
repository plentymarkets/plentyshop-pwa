import type { PreviewState, ResolvePreviewStateOptions } from './types';

export const resolvePreviewState = async ({
  cookieValue,
  isPreviewConfig,
  getPreviewValid,
}: ResolvePreviewStateOptions): Promise<PreviewState> => {
  if (isPreviewConfig) {
    return { isEditor: true, isPreview: false };
  }

  if (!cookieValue) {
    return { isEditor: false, isPreview: false };
  }

  const data = await getPreviewValid();

  if (data?.valid && data.permission === 'write') {
    return { isEditor: true, isPreview: false };
  }

  if (data?.valid && data.permission === 'read') {
    return { isEditor: false, isPreview: true };
  }

  return { isEditor: false, isPreview: false };
};
