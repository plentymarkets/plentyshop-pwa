export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const isEditingDisabled = useState('isEditingDisabled', () => false);
  return { isEditing, isEditingDisabled };
};
