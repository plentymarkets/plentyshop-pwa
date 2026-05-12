import { v4 as uuidv4 } from 'uuid';

export interface LayoutPreset {
  readonly label: string;
  readonly spans: readonly number[];
}

export const LAYOUT_PRESETS: readonly LayoutPreset[] = [
  { label: '1 Col', spans: [12] },
  { label: '2 Equal', spans: [6, 6] },
  { label: 'Sidebar L', spans: [3, 9] },
  { label: 'Sidebar R', spans: [9, 3] },
  { label: '3 Equal', spans: [4, 4, 4] },
  { label: '4 Equal', spans: [3, 3, 3, 3] },
];

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

export const createEmptyGridBlock = (parentSlot: number) => ({
  name: 'EmptyGridBlock' as const,
  type: 'content' as const,
  content: [] as never[],
  meta: { uuid: uuidv4() },
  parent_slot: parentSlot,
});
