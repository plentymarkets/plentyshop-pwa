import type { ApiGroup } from '~/components/blocks/PriceCard/types';

export const mockProperty1 = {
  id: 10,
  names: { en: 'Color', de: 'Farbe' },
  descriptions: { en: '', de: '' },
  cast: 'text',
};

export const mockProperty2 = {
  id: 20,
  names: { en: 'Size', de: 'Größe' },
  descriptions: { en: '', de: '' },
  cast: 'text',
};

export const mockProperty3 = {
  id: 30,
  names: { en: null, de: null },
  descriptions: { en: '', de: '' },
  cast: 'text',
};

export const mockGroup1: ApiGroup = {
  id: 1,
  position: 0,
  names: { en: 'Appearance', de: 'Erscheinungsbild' },
  descriptions: { en: '', de: '' },
  properties: [mockProperty1, mockProperty2],
};

export const mockGroup2: ApiGroup = {
  id: 2,
  position: 1,
  names: { en: 'Technical', de: 'Technisch' },
  descriptions: { en: '', de: '' },
  properties: [mockProperty3],
};

export const mockGroups: ApiGroup[] = [mockGroup1, mockGroup2];

export const mockGetEditorItemProperties = vi.fn();

export const mockSdkSuccess = (groups: ApiGroup[] = mockGroups) => {
  mockGetEditorItemProperties.mockResolvedValueOnce(groups);
};

export const mockSdkError = (message = 'Network error') => {
  mockGetEditorItemProperties.mockRejectedValueOnce(new Error(message));
};

