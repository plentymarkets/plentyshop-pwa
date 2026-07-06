import type { AiCoreFunctionality } from '~/composables/useAiTextGeneration/types';

export type AiDraftPhase = 'idle' | 'prompt' | 'generating' | 'review';
export type AiTone = 'Friendly' | 'Formal' | 'Bold';
export type AiLength = 'Short' | 'Medium' | 'Long';

export interface AiDraftFlowState {
  phase: AiDraftPhase;
  prompt: string;
  tone: AiTone;
  length: AiLength;
  refineOpen: boolean;
  snapshot: string;
  draft: string;
}

export interface AiChipSuggestion {
  label: string;
  text: string;
}

export interface UseAiDraftFlowOptions {
  storageKey?: string;
  coreFunctionality?: AiCoreFunctionality;
  getCurrentContent?: () => string;
  onApply?: (content: string) => void;
}
