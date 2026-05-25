import type { UseBlocksMutationsReturn } from './types';

export const useBlocksMutations: UseBlocksMutationsReturn = () => {
  const insertColumnUuid = useState<string | null>('insertColumnUuid', () => null);

  const setInsertColumnUuid = (uuid: string) => {
    insertColumnUuid.value = uuid;
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
