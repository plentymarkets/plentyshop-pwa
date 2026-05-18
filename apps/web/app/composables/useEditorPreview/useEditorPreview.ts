export type PreviewDevice = 'mobile' | 'tablet' | 'desktop';

const getDevice = () => {
  if (typeof window === 'undefined') return ref<PreviewDevice>('desktop');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (!w.__editorPreviewDevice) {
    w.__editorPreviewDevice = ref<PreviewDevice>('desktop');
  }
  return w.__editorPreviewDevice as Ref<PreviewDevice>;
};

export const useEditorPreview = () => {
  const device = getDevice();

  const setDevice = (d: PreviewDevice) => {
    device.value = d;
  };

  const width = computed(() => {
    if (device.value === 'mobile') return '375px';
    if (device.value === 'tablet') return '768px';
    return '100%';
  });

  return { device, setDevice, width };
};