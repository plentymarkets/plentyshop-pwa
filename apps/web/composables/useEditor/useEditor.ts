import { reactive } from 'vue';

const state = reactive({
  isEditing: false,
});

const useEditor = () => {
  return state;
};

export default useEditor;
