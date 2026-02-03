import type { UseRichTextEditorArgs, RteAlign } from '../types';

export const createTestArgs = (): UseRichTextEditorArgs => ({
  modelValue: ref(''),
  onUpdateModelValue: vi.fn(),
  expanded: ref(false),
  onUpdateExpanded: vi.fn(),
  textAlign: ref<RteAlign>('left'),
});
