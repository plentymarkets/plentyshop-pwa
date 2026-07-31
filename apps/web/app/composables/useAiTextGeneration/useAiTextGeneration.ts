import type { ApiError } from '@plentymarkets/shop-api';
import type {
  AiGenerationResult,
  UseAiTextGeneration,
  UseAiTextGenerationReturn,
  UseAiTextGenerationState,
} from './types';

const parseAiTextBlockPayload = (raw: string): AiGenerationResult => {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) {
    return { status: 'ok', content: '' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      const status = parsed.status === 'error' ? 'error' : 'ok';
      const content = typeof parsed.content === 'string' ? parsed.content : '';
      return { status, content };
    }
  } catch {
    //
  }

  return { status: 'ok', content: trimmed };
};

/**
 * @description Composable that wraps `doGenerateAiTextBlock` for generating
 * text via the AI text-block endpoint. Returns the assistant reply as a plain
 * string so callers can hand it to any RTE/textarea.
 * @example
 * ``` ts
 * const { generate, loading, response, error } = useAiTextGeneration();
 * const text = await generate({ prompt: 'Write a product blurb about ...' });
 * ```
 */
export const useAiTextGeneration: UseAiTextGenerationReturn = (storageKey = 'useAiTextGeneration') => {
  const state = useState<UseAiTextGenerationState>(storageKey, () => ({
    response: '',
    loading: false,
    error: '',
  }));

  const reset = () => {
    state.value.response = '';
    state.value.error = '';
    state.value.loading = false;
  };

  const notifyError = (message: string) => {
    state.value.error = message;
    if (message) {
      useNotification().send({ message, type: 'negative' });
    }
  };

  const generate: UseAiTextGeneration['generate'] = async (params) => {
    state.value.loading = true;
    state.value.error = '';
    state.value.response = '';

    try {
      const { data } = await useSdk().plentysystems.doGenerateAiTextBlock({ prompt: params.prompt });

      const result = parseAiTextBlockPayload(data?.text ?? '');

      if (result.status === 'error') {
        notifyError(result.content || 'AI generation failed.');
      } else {
        state.value.response = result.content;
      }

      return result;
    } catch (error: unknown) {
      const message = (error as Error)?.message ?? 'AI generation failed.';
      notifyError(message);
      useHandleError(error as ApiError);
      return { status: 'error', content: message };
    } finally {
      state.value.loading = false;
    }
  };

  return {
    response: readonly(computed(() => state.value.response)),
    loading: readonly(computed(() => state.value.loading)),
    error: readonly(computed(() => state.value.error)),
    generate,
    reset,
  };
};
