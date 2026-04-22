import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useBlockTemplates } from '../useBlockTemplates';

const { useSdk } = vi.hoisted(() => ({
  useSdk: vi.fn().mockReturnValue({
    plentysystems: { getCategoryTemplate: vi.fn() },
  }),
}));

const { useAsyncData } = vi.hoisted(() => ({
  useAsyncData: vi.fn(),
}));

const { useState } = vi.hoisted(() => ({
  useState: vi.fn(),
}));

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useAsyncData', () => useAsyncData);
mockNuxtImport('useState', () => useState);

describe('useBlockTemplates', () => {
  let mockStateRef: { value: { categoryTemplateData: unknown } };
  let mockGetCategoryTemplate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStateRef = { value: { categoryTemplateData: null } };
    useState.mockReturnValue(mockStateRef);

    mockGetCategoryTemplate = vi.fn();
    useSdk.mockReturnValue({
      plentysystems: { getCategoryTemplate: mockGetCategoryTemplate },
    });

    useAsyncData.mockImplementation((_key: string, _fetcher: () => void) => ({
      data: { value: null },
      error: { value: null },
    }));
  });

  it('should fetch category template data', async () => {
    useAsyncData.mockImplementation((_key: string, _fetcher: () => void) => ({
      data: { value: { data: { id: 1, name: 'Test Template' } } },
      error: { value: null },
    }));

    await useBlockTemplates().fetchCategoryTemplate(1);

    expect(useAsyncData).toHaveBeenCalledWith('fetchCategoryTemplate-1', expect.any(Function));
    expect(mockStateRef.value.categoryTemplateData).toEqual({ id: 1, name: 'Test Template' });
  });

  it('should keep existing data if fetch returns null', async () => {
    mockStateRef.value.categoryTemplateData = { id: 99, name: 'Existing' };

    await useBlockTemplates().fetchCategoryTemplate(2);

    expect(mockStateRef.value.categoryTemplateData).toEqual({ id: 99, name: 'Existing' });
  });

  it('should expose categoryTemplateData as computed', () => {
    const { categoryTemplateData } = useBlockTemplates();
    expect(categoryTemplateData).toBeDefined();
    expect(categoryTemplateData.value).toBeNull();
  });
});
