import { useFullWidthToggleForConfig } from '../useFullWidthToggle';

describe('useFullWidthToggleForConfig', () => {
  it('should return the default fullWidth value if layout is missing', () => {
    const config = ref<{ layout?: { fullWidth?: boolean } }>({});
    const { isFullWidth } = useFullWidthToggleForConfig(config, { fullWidth: true });

    expect(isFullWidth.value).toBe(true);
  });

  it('should return the layout fullWidth value if present', () => {
    const config = ref<{ layout?: { fullWidth?: boolean } }>({ layout: { fullWidth: false } });
    const { isFullWidth } = useFullWidthToggleForConfig(config, { fullWidth: true });

    expect(isFullWidth.value).toBe(false);
  });

  it('should initialize layout if missing when setting fullWidth', () => {
    const config = ref<{ layout?: { fullWidth?: boolean } }>({});
    const { isFullWidth } = useFullWidthToggleForConfig(config, { fullWidth: false });

    isFullWidth.value = true;

    expect(config.value.layout).toBeDefined();
    expect(config.value.layout?.fullWidth).toBe(true);
  });

  it('should update fullWidth value when layout exists', () => {
    const config = ref<{ layout?: { fullWidth?: boolean } }>({ layout: { fullWidth: false } });
    const { isFullWidth } = useFullWidthToggleForConfig(config);

    isFullWidth.value = true;

    expect(config.value.layout?.fullWidth).toBe(true);
  });

  it('should preserve other layout properties when updating fullWidth', () => {
    const config = ref<{ layout?: { fullWidth?: boolean; marginTop?: number } }>({
      layout: { fullWidth: false, marginTop: 10 },
    });
    const { isFullWidth } = useFullWidthToggleForConfig(config);

    isFullWidth.value = true;

    expect(config.value.layout?.fullWidth).toBe(true);
    expect(config.value.layout?.marginTop).toBe(10);
  });
});
