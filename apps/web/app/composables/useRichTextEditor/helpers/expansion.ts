import type { UseRichTextEditorArgs } from '../types';

export const setupRichTextEditorExpansion = (args: UseRichTextEditorArgs) => {
  const expandedLocal = ref<boolean>(args.expanded?.value ?? false);

  if (args.expanded && args.onUpdateExpanded) {
    watch(args.expanded, (val) => (expandedLocal.value = !!val));
    watch(expandedLocal, (val) => args.onUpdateExpanded?.(val));
  }

  return {
    expandedLocal,
  };
};
