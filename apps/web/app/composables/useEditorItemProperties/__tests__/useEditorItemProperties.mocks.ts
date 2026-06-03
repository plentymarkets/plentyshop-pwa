import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';
import type { ItemProperty, ItemPropertyGroup } from '../types';

export const mockProperty1: ItemPropertyTranslated = {
  id: 10,
  cast: 'text',
  name: 'Color',
  description: '',
};

export const mockProperty2: ItemPropertyTranslated = {
  id: 20,
  cast: 'text',
  name: 'Size',
  description: '',
};

export const mockProperty3: ItemPropertyTranslated = {
  id: 30,
  cast: 'text',
  name: 'Missing translation for id: 30',
  description: '',
};

export const mockGroup1: ApiGroup = {
  id: 1,
  position: 0,
  name: 'Appearance',
  description: '',
  properties: [mockProperty1, mockProperty2],
};

export const mockGroup2: ApiGroup = {
  id: 2,
  position: 1,
  name: 'Technical',
  description: '',
  properties: [mockProperty3],
};

export const mockGroups: ApiGroup[] = [mockGroup1, mockGroup2];

const mockRawProperty1: ItemProperty = {
  id: 10,
  cast: 'text',
  names: { en: 'Color', de: 'Farbe' },
  descriptions: { en: '', de: '' },
};

const mockRawProperty2: ItemProperty = {
  id: 20,
  cast: 'text',
  names: { en: 'Size', de: 'Größe' },
  descriptions: { en: '', de: '' },
};

const mockRawProperty3: ItemProperty = {
  id: 30,
  cast: 'text',
  names: {},
  descriptions: {},
};

export const mockRawGroup1: ItemPropertyGroup = {
  id: 1,
  position: 0,
  names: { en: 'Appearance', de: 'Erscheinung' },
  descriptions: { en: '', de: '' },
  properties: [mockRawProperty1, mockRawProperty2],
};

export const mockRawGroup2: ItemPropertyGroup = {
  id: 2,
  position: 1,
  names: { en: 'Technical', de: 'Technisch' },
  descriptions: { en: '', de: '' },
  properties: [mockRawProperty3],
};

export const mockRawGroups: ItemPropertyGroup[] = [mockRawGroup1, mockRawGroup2];

export const mockGetItemProperties = vi.fn();

export const mockSdkSuccess = (groups: ItemPropertyGroup[] = mockRawGroups) => {
  mockGetItemProperties.mockResolvedValueOnce({ data: groups });
};

export const mockSdkError = (message = 'Network error') => {
  mockGetItemProperties.mockRejectedValueOnce(new Error(message));
};
