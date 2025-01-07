import { ModuleRenderingAreas } from './areas';

export const useModuleRendering = (block: string) => {
  if (!ModuleRenderingAreas.includes(block)) throw new Error('Invalid module rendering area: ' + block);

  const state = useState('useModuleRendering_' + block, () => ({
    components: [] as string[],
  }));

  const addComponent = (componentName: string) => {
    if (state.value.components.includes(componentName)) return;
    state.value.components.push(componentName);
  };

  return {
    addComponent,
    ...toRefs(state.value),
  };
};
