export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const disableActions = useState('disableActions', () => true);
  const isEditingEnabled = useState('isEditingEnabled', () => true);
  return { isEditing, isEditingEnabled, disableActions };
};
