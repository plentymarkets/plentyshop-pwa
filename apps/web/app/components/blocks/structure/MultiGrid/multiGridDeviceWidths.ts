import { computed, toValue } from 'vue';
import type { MaybeRef } from 'vue';
import type { MultiGridColumnConfig } from './types';
import type { PreviewDevice } from '~/composables/useEditorDevice/types';

export function getColumnWidthsForDevice(config: MultiGridColumnConfig, device: PreviewDevice): number[] {
  const baseWidths = config.columnWidths ?? [];
  if (device === 'mobile') return config.columsWidthsMobile ?? baseWidths.map(() => 12);
  if (device === 'tablet') return config.columsWidthsTablet ?? [...baseWidths];
  return baseWidths;
}

export function setDeviceColumnWidths(config: MultiGridColumnConfig, device: PreviewDevice, widths: number[]): void {
  if (device === 'mobile') config.columsWidthsMobile = widths;
  else if (device === 'tablet') config.columsWidthsTablet = widths;
  else config.columnWidths = widths;
}

export function getDeviceColumnWidths(config: MaybeRef<MultiGridColumnConfig>) {
  const { isInEditorClient, device } = useEditorState();
  const viewport = useViewport();

  const effectiveDevice = computed((): PreviewDevice => {
    if (isInEditorClient.value) return device.value as PreviewDevice;
    const bp = viewport.breakpoint.value;
    if (bp === 'xs' || bp === 'sm') return 'mobile';
    if (bp === 'md') return 'tablet';
    return 'desktop';
  });

  const columnWidths = computed(() => getColumnWidthsForDevice(toValue(config), effectiveDevice.value));

  return { columnWidths, effectiveDevice };
}
