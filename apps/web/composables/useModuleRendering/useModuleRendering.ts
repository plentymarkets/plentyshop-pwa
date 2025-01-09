import { ModuleRenderingAreas } from './areas';

export const useModuleRendering = (area: string) => {
  if (!ModuleRenderingAreas.includes(area)) throw new Error('Invalid module rendering area: ' + area);

  const state = useState('useModuleRendering_' + area, () => ({
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
