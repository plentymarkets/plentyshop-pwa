import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';

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

export const mockGetItemProperties = vi.fn();

export const mockSdkSuccess = (groups: ApiGroup[] = mockGroups) => {
  mockGetItemProperties.mockResolvedValueOnce({ data: groups });
};

export const mockSdkError = (message = 'Network error') => {
  mockGetItemProperties.mockRejectedValueOnce(new Error(message));
};
