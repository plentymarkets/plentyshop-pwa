import type { UseBlocksMutationsReturn } from './types';

export const useBlocksMutations: UseBlocksMutationsReturn = () => {
  const insertColumnUuid = useState<string | null>('insertColumnUuid', () => null);

  const setInsertColumnUuid = (uuid: string) => {
    insertColumnUuid.value = uuid;
    if (import.meta.client && window.parent !== window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parentBridge = (window.parent as any).__editorBridge;
      if (typeof parentBridge?.onSetInsertColumnUuid === 'function') {
        parentBridge.onSetInsertColumnUuid(uuid);
      }
    }
  };

  const clearInsertColumnUuid = () => {
    insertColumnUuid.value = null;
  };

  return {
    insertColumnUuid,
    setInsertColumnUuid,
    clearInsertColumnUuid,
  };
};
