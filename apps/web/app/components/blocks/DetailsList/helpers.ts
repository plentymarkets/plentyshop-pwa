import type { Block } from '@plentymarkets/shop-api';
import type { DetailsListItemConfiguration, DetailsListStructureConfiguration } from './types';

const getDetailsSettings = (block: Block) =>
  (block.configuration as DetailsListItemConfiguration | undefined)?.detailsSettings;

export const getDetailsListIconPosition = (
  configuration: DetailsListStructureConfiguration | undefined,
): 'start' | 'end' => (configuration?.layout?.caretPosition === 'right' ? 'end' : 'start');

export const getDetailsListItemLabel = (block: Block, index: number, fallbackPrefix: string): string => {
  const label = getDetailsSettings(block)?.label?.trim();
  if (label) {
    return label;
  }

  return `${fallbackPrefix} ${index + 1}`;
};

export const getDetailsListItemDefaultOpen = (block: Block): boolean => getDetailsSettings(block)?.defaultOpen ?? false;
