export type AiCoreFunctionality = 'core-support' | 'core-supervisor' | 'core-cms-text-block';

export interface AiTextBlockRequest {
  prompt: string;
  sessionId?: string;
  user?: string;
  pid?: number;
}

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
  sessionId?: string;
  user?: string;
  pid?: number;
  coreFunctionality?: AiCoreFunctionality;
}

export interface UseAiTextGeneration {
  response: Readonly<Ref<string>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string>>;
  generate: (params: GenerateParams) => Promise<AiGenerationResult>;
  reset: () => void;
}

export type UseAiTextGenerationReturn = (storageKey?: string) => UseAiTextGeneration;
