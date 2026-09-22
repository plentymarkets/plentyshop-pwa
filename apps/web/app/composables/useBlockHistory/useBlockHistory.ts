import { useThrottledRefHistory } from '@vueuse/core';
import type { GetBlocksResponse } from '@plentymarkets/shop-api';
import type { UseBlockHistory, UseBlockHistoryReturn } from './types';

const HISTORY_THROTTLE_MS = 800;
const HISTORY_CAPACITY = 50;

let instance: UseBlockHistory | null = null;

const createInertHistory = (): UseBlockHistory => ({
  canUndo: computed(() => false),
  canRedo: computed(() => false),
  undo: () => {},
  redo: () => {},
  resetHistory: () => {},
});

const createBlockHistory = (): UseBlockHistory => {
  const { data, restoreBlocks } = useBlocks();

  const trackedData = computed({
    get: () => data.value,
    set: (value: GetBlocksResponse) => restoreBlocks(value),
  });

  const history = useThrottledRefHistory(trackedData, {
    deep: true,
    throttle: HISTORY_THROTTLE_MS,
    capacity: HISTORY_CAPACITY,
    clone: deepClone,
  });

  /**
   * @description
   * Resets the block edit history, including the internal baseline snapshot.
   *
   * @remarks
   * `clear()` only empties the undo/redo stacks, not the internal `last` baseline.
   * Without re-stamping it, a throttled commit still pending from the page we just
   * navigated away from could later land on the new page's stack.
   */
  const resetHistory = () => {
    history.clear();
    history.last.value = { snapshot: deepClone(data.value), timestamp: Date.now() };
  };

  return {
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo: history.undo,
    redo: history.redo,
    resetHistory,
  };
};

/**
 * Client-side, session-scoped undo/redo for block edits on the current page.
 * Tracks only `useBlocks().data` (never site settings) and is reset whenever
 * the merchant navigates to a different page.
 */
export const useBlockHistory: UseBlockHistoryReturn = () => {
  if (!import.meta.client) {
    return createInertHistory();
  }

  if (!instance) {
    instance = createBlockHistory();
  }

  return instance;
};
