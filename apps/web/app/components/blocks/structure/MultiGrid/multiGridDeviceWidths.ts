import type { MultiGridColumnConfig } from './types';

/**
 * Returns the column widths for the current editor device (mobile/tablet/desktop).
 * Falls back to desktop widths (or all-12 for mobile) when no device-specific widths are stored yet.
 * Call useEditorState() in the component setup and pass device.value here.
 */
export function getDeviceColumnWidths(config: MultiGridColumnConfig, device: string): number[] {
  const baseWidths = config.columnWidths ?? [];
  if (device === 'mobile') return config.columsWidthsMobile ?? baseWidths.map(() => 12);
  if (device === 'tablet') return config.columsWidthsTablet ?? [...baseWidths];
  return baseWidths;
}

/**
 * Writes column widths back into the correct device-specific field of the config.
 * Call useEditorState() in the component setup and pass device.value here.
 */
export function setDeviceColumnWidths(config: MultiGridColumnConfig, device: string, widths: number[]): void {
  if (device === 'mobile') config.columsWidthsMobile = widths;
  else if (device === 'tablet') config.columsWidthsTablet = widths;
  else config.columnWidths = widths;
}
