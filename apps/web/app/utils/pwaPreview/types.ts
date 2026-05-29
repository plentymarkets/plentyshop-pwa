export interface ResolvePreviewStateOptions {
  cookieValue: string | null | undefined;
  isPreviewConfig: boolean;
  getPreviewValid: () => Promise<{ data: boolean }>;
}
