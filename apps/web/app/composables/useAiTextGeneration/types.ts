import type { CoreFunctionality } from '@plentymarkets/shop-api';

export type AiGenerationStatus = 'ok' | 'error';

export interface AiGenerationResult {
  status: AiGenerationStatus;
  content: string;
}

export interface UseAiTextGenerationState {
  response: string;
  loading: boolean;
  error: string;
}

export interface GenerateParams {
  prompt: string;
  coreFunctionality?: CoreFunctionality;
  sessionId?: string;
  user?: string;
  qualifier?: string;
}

export interface UseAiTextGeneration {
  response: Readonly<Ref<string>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string>>;
  generate: (params: GenerateParams) => Promise<AiGenerationResult>;
  reset: () => void;
}

export type UseAiTextGenerationReturn = (storageKey?: string) => UseAiTextGeneration;
