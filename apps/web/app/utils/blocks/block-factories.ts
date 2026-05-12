export const createMultiGridBlock = (columnWidths: readonly number[]) => ({
  name: 'MultiGrid' as const,
  type: 'structure' as const,
  meta: { uuid: '' },
  configuration: { columnWidths: [...columnWidths], fullWidth: false, visible: true },
  content: columnWidths.map((_, i) => ({
    name: 'EmptyGridBlock' as const,
    type: 'content' as const,
    meta: { uuid: '' },
    parent_slot: i,
    content: [] as never[],
  })),
});
