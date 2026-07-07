import type { AiChipSuggestion, AiDraftFlowState, AiLength, AiTone, UseAiDraftFlowOptions } from './types';

const CHIP_SUGGESTIONS: AiChipSuggestion[] = [
  {
    label: 'Product description',
    text: 'A compelling product description that highlights the key features, materials, and benefits for the shopper',
  },
  {
    label: 'Sales Banner',
    text: 'A short, high-energy promo banner announcing a limited-time sale with a clear call to action',
  },
  {
    label: 'Shipping & returns',
    text: 'A clear, trust-building shipping and returns section that reassures shoppers before they buy',
  },
  {
    label: 'Category intro',
    text: 'An engaging intro for a category landing page that helps shoppers browse with confidence',
  },
];

const TONES: AiTone[] = ['Friendly', 'Formal', 'Bold'];
const LENGTHS: AiLength[] = ['Short', 'Medium', 'Long'];

const LENGTH_HINTS: Record<AiLength, string> = {
  Short: 'about one short sentence',
  Medium: 'two or three sentences',
  Long: 'a full paragraph',
};

const buildPrompt = (state: AiDraftFlowState) =>
  `Tone: ${state.tone}. Length: ${LENGTH_HINTS[state.length]}.\n\n${state.prompt.trim()}`;

/**
 * @description State machine for the AI Write flow shown above the rich text
 * editor. Orchestrates the prompt → generate → review → keep / discard cycle
 * and calls `useAiTextGeneration` under the hood for the actual SDK invocation.
 *
 * @example
 * ``` ts
 * const flow = useAiDraftFlow({
 *   getCurrentContent: () => editor.value?.getHTML() ?? '',
 *   onApply: (html) => editor.value?.commands.setContent(html),
 * });
 * flow.generate();
 * ```
 */
export const useAiDraftFlow = (options: UseAiDraftFlowOptions = {}) => {
  const storageKey = options.storageKey ?? 'useAiDraftFlow';

  const state = useState<AiDraftFlowState>(storageKey, () => ({
    phase: 'idle',
    prompt: '',
    tone: 'Friendly',
    length: 'Medium',
    refineOpen: false,
    snapshot: '',
    draft: '',
  }));

  const { generate: invokeAi, loading } = useAiTextGeneration(`${storageKey}:gen`);

  const isOpen = computed(() => state.value.phase === 'prompt' || state.value.phase === 'generating');
  const isPromptOpen = computed(() => state.value.phase === 'prompt');
  const isGenerating = computed(() => state.value.phase === 'generating');
  const isReviewing = computed(() => state.value.phase === 'review');
  const aiActive = computed(() => isOpen.value || isReviewing.value);
  const canGenerate = computed(() => state.value.prompt.trim().length > 0 && !loading.value);

  const promptModel = computed({
    get: () => state.value.prompt,
    set: (value: string) => {
      state.value.prompt = value;
    },
  });

  const toggle = () => {
    if (state.value.phase === 'generating') {
      return;
    }
    state.value.phase = isOpen.value ? 'idle' : 'prompt';
    if (state.value.phase === 'idle') {
      state.value.refineOpen = false;
    }
  };

  const close = () => {
    if (state.value.phase === 'generating') {
      return;
    }
    state.value.phase = 'idle';
    state.value.refineOpen = false;
  };

  const useChip = (chip: AiChipSuggestion) => {
    state.value.prompt = chip.text;
  };

  const setTone = (tone: AiTone) => {
    state.value.tone = tone;
  };

  const setLength = (length: AiLength) => {
    state.value.length = length;
  };

  const toggleRefine = () => {
    state.value.refineOpen = !state.value.refineOpen;
  };

  const generate = async () => {
    if (!state.value.prompt.trim() || loading.value) {
      return;
    }

    if (!state.value.draft) {
      state.value.snapshot = options.getCurrentContent?.() ?? '';
    }

    state.value.phase = 'generating';

    const result = await invokeAi({
      prompt: buildPrompt(state.value),
      coreFunctionality: options.coreFunctionality,
    });

    if (state.value.phase !== 'generating') {
      return;
    }

    if (result.status === 'error') {
      state.value.phase = 'prompt';
      return;
    }

    state.value.draft = result.content;
    state.value.phase = 'review';
    options.onApply?.(result.content);
  };

  const modify = () => {
    if (state.value.phase !== 'review') {
      return;
    }
    state.value.phase = 'prompt';
  };

  const stop = () => {
    if (state.value.phase !== 'generating') {
      return;
    }
    state.value.phase = 'prompt';
  };

  const discard = () => {
    options.onApply?.(state.value.snapshot);
    state.value.draft = '';
    state.value.phase = 'prompt';
  };

  const keep = () => {
    state.value.draft = '';
    state.value.phase = 'idle';
    state.value.refineOpen = false;
  };

  return {
    state,
    promptModel,
    isOpen,
    isPromptOpen,
    isGenerating,
    isReviewing,
    aiActive,
    canGenerate,
    loading,
    chips: CHIP_SUGGESTIONS,
    tones: TONES,
    lengths: LENGTHS,
    toggle,
    close,
    useChip,
    setTone,
    setLength,
    toggleRefine,
    generate,
    modify,
    stop,
    discard,
    keep,
  };
};
