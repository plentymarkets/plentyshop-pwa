import type { MultiGridColumnConfig } from './types';
import type { PreviewDevice } from '~/composables/useEditorDevice/types';

const resolveDevice = (isInEditorClient: boolean, device: PreviewDevice, breakpoint: string): PreviewDevice => {
  if (isInEditorClient) return device;
  if (breakpoint === 'xs' || breakpoint === 'sm') return 'mobile';
  if (breakpoint === 'md') return 'tablet';
  return 'desktop';
};

const widthsForDevice = (config: MultiGridColumnConfig, device: PreviewDevice): number[] => {
  const baseWidths = config.columnWidths ?? [];
  if (device === 'mobile') return config.columnWidthsMobile ?? baseWidths.map(() => 12);
  if (device === 'tablet') return config.columnWidthsTablet ?? [...baseWidths];
  return baseWidths;
};

export const useMultiGridDeviceWidths = (config: MaybeRef<MultiGridColumnConfig>) => {
  const { isInEditorClient, device } = useEditorState();
  const viewport = useViewport();

  const effectiveDevice = computed(() =>
    resolveDevice(isInEditorClient.value, device.value, viewport.breakpoint.value),
  );

  const widths = computed(() => widthsForDevice(toValue(config), effectiveDevice.value));

  const mobileFullWidthColumn = computed(() => viewport.isLessThan('md'));

  const setWidths = (newWidths: number[]) => {
    const cfg = toValue(config);
    if (effectiveDevice.value === 'mobile') cfg.columnWidthsMobile = newWidths;
    else if (effectiveDevice.value === 'tablet') cfg.columnWidthsTablet = newWidths;
    else cfg.columnWidths = newWidths;
  };

  return { widths, setWidths, mobileFullWidthColumn };
};
