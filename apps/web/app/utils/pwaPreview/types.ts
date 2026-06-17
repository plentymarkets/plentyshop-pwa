import type { PreviewValidResponse } from '@plentymarkets/shop-api';
export interface ResolvePreviewStateOptions {
  cookieValue: string | null | undefined;
  isPreviewConfig: boolean;
  getPreviewValid: () => Promise<PreviewValidResponse | null | undefined>;
}
