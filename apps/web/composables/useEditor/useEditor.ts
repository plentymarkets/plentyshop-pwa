export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const disableActions = useState('disableActions', () => false);
  const isEditingEnabled = useState('isEditingEnabled', () => true);
  return { isEditing, isEditingEnabled, disableActions };
};
