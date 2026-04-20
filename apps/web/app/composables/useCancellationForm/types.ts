import type { CancellationFormParams } from '@plentymarkets/shop-api';

export interface UseCancellationFormState {
  loading: boolean;
}

export type SubmitCancellation = (params: CancellationFormParams) => Promise<string | null>;
