export const useBlockEditTitle = () => {
  const editTitle = useState<string | null>('block-edit-title', () => null);

  const setEditTitle = (title: string) => {
    editTitle.value = title;
  };

  const clearEditTitle = () => {
    editTitle.value = null;
  };

  return { editTitle, setEditTitle, clearEditTitle };
};
