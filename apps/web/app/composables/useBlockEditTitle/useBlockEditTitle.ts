export const useBlockEditTitle = () => {
  const editTitle = useState<string | null>('block-edit-title', () => null);
  const editUuid = useState<string | null>('block-edit-uuid', () => null);

  const setEditTitle = (title: string, uuid?: string) => {
    editTitle.value = title;
    editUuid.value = uuid ?? null;
  };

  const clearEditTitle = () => {
    editTitle.value = null;
    editUuid.value = null;
  };

  return { editTitle, editUuid, setEditTitle, clearEditTitle };
};
