export const useEditor = () => {
  const isEditing = useState('isEditing', () => false);
  const disableActions = useState('disableActions', () => true);
  const isEditingEnabled = useState('isEditingEnabled', () => true);
  const jsonHasData = useState('jsonHasData', () => true);
  return { isEditing, isEditingEnabled, disableActions, jsonHasData };
};
