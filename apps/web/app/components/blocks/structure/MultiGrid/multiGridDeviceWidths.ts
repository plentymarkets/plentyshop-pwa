import type { MultiGridColumnConfig } from './types';
import type { PreviewDevice } from '~/composables/useEditorDevice/types';

function resolveDevice(isInEditorClient: boolean, device: string, breakpoint: string): PreviewDevice {
  if (isInEditorClient) return device as PreviewDevice;
  if (breakpoint === 'xs' || breakpoint === 'sm') return 'mobile';
  if (breakpoint === 'md') return 'tablet';
  return 'desktop';
}

function widthsForDevice(config: MultiGridColumnConfig, device: PreviewDevice): number[] {
  const baseWidths = config.columnWidths ?? [];
  if (device === 'mobile') return config.columnWidthsMobile ?? baseWidths.map(() => 12);
  if (device === 'tablet') return config.columnWidthsTablet ?? [...baseWidths];
  return baseWidths;
}

export function getDeviceColumnWidths(config: MaybeRef<MultiGridColumnConfig>): ComputedRef<number[]> {
  const { isInEditorClient, device } = useEditorState();
  const viewport = useViewport();
  return computed(() =>
    widthsForDevice(toValue(config), resolveDevice(isInEditorClient.value, device.value, viewport.breakpoint.value)),
  );
}

export function setDeviceColumnWidths(config: MultiGridColumnConfig, widths: number[]): void {
  const { isInEditorClient, device } = useEditorState();
  const viewport = useViewport();
  const d = resolveDevice(isInEditorClient.value, device.value, viewport.breakpoint.value);
  if (d === 'mobile') config.columnWidthsMobile = widths;
  else if (d === 'tablet') config.columnWidthsTablet = widths;
  else config.columnWidths = widths;
}
