import type { MaybeRefOrGetter } from 'vue';

export interface UseColumnSticky {
  isSticky: (columnIndex: number) => boolean;
  toggleSticky: (columnIndex: number) => void;
}

export type UseColumnStickyReturn = (parentUuid: MaybeRefOrGetter<string | undefined>) => UseColumnSticky;
