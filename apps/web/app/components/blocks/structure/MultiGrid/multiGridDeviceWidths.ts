import type { MultiGridColumnConfig } from './types';
import type { PreviewDevice } from '~/composables/useEditorDevice/types';

function resolveEffectiveDevice(): ComputedRef<PreviewDevice> {
  const { isInEditorClient, device } = useEditorState();
  const viewport = useViewport();
  return computed(() => {
    if (isInEditorClient.value) return device.value as PreviewDevice;
    const bp = viewport.breakpoint.value;
    if (bp === 'xs' || bp === 'sm') return 'mobile';
    if (bp === 'md') return 'tablet';
    return 'desktop';
  });
}

function widthsForDevice(config: MultiGridColumnConfig, device: PreviewDevice): number[] {
  const baseWidths = config.columnWidths ?? [];
  if (device === 'mobile') return config.columsWidthsMobile ?? baseWidths.map(() => 12);
  if (device === 'tablet') return config.columsWidthsTablet ?? [...baseWidths];
  return baseWidths;
}

export function getDeviceColumnWidths(config: MaybeRef<MultiGridColumnConfig>): ComputedRef<number[]> {
  const effectiveDevice = resolveEffectiveDevice();
  return computed(() => widthsForDevice(toValue(config), effectiveDevice.value));
}

export function setDeviceColumnWidths(config: MultiGridColumnConfig, widths: number[]): void {
  const device = resolveEffectiveDevice().value;
  if (device === 'mobile') config.columsWidthsMobile = widths;
  else if (device === 'tablet') config.columsWidthsTablet = widths;
  else config.columnWidths = widths;
}
