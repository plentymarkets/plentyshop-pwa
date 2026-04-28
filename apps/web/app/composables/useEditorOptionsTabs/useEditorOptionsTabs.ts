import type { EditorTarget, TranslateFn } from '~/composables/useEditorOptionsTabs/types';
import { useTextboxOptions } from './useTextboxOptions';
import { useTextOptions } from './useTextOptions';
import { useButtonOptions } from './useButtonOptions';
import { useImageOptions } from './useImageOptions';
import { useProductOptions } from './useProductOptions';
import { useFootnoteOptions } from './useFootnoteOptions';

export function useEditorOptionsTabs(getTarget: () => EditorTarget, t: TranslateFn) {
  return {
    ...useTextboxOptions(getTarget, t),
    ...useTextOptions(getTarget, t),
    ...useButtonOptions(getTarget, t),
    ...useImageOptions(getTarget, t),
    ...useProductOptions(getTarget, t),
    ...useFootnoteOptions(getTarget, t),
  };
}
