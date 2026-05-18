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
  const viewport = useViewport();
  const device = getDevice();

  const setDevice = (d: PreviewDevice) => {
    if (d === 'mobile') {
        viewport.breakpoint.value = 'xs';
    } else if (d === 'tablet') {
        viewport.breakpoint.value = 'md';
    } else {
        for (const [key, { mediaQuery }] of Object.entries(viewport.queries.value)) {
            if (window.matchMedia(mediaQuery).matches) {
                viewport.breakpoint.value = key;
                break;
            }
        }
    }

    device.value = d;
  };

  const width = computed(() => {
    if (device.value === 'mobile') return '375px';
    if (device.value === 'tablet') return '768px';
    return '100%';
  });


    const height = computed(() => {
    if (device.value === 'mobile') return '812px';
    if (device.value === 'tablet') return '1024px';
    return undefined;
    });

  return { device, setDevice, width, height };
};
