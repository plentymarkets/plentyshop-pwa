import { Data, PreviewValidResponse } from "@plentymarkets/shop-api";
export interface ResolvePreviewStateOptions {
  cookieValue: string | null | undefined;
  isPreviewConfig: boolean;
  getPreviewValid: () => Promise<Data<PreviewValidResponse> | null | undefined>;
}
  