import { mount, flushPromises } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { UiImageTable } from '#components';
import type { StorageObject } from '@plentymarkets/shop-api';

const { useItemsTableMock, useImageMetadataMock, getStorageMetadataMock, setMetadataMock } = vi.hoisted(() => ({
  useItemsTableMock: vi.fn(),
  useImageMetadataMock: vi.fn(),
  getStorageMetadataMock: vi.fn(),
  setMetadataMock: vi.fn(),
}));

mockNuxtImport('useItemsTable', () => useItemsTableMock);
mockNuxtImport('useImageMetadata', () => useImageMetadataMock);

const SfInputStub = defineComponent({
  name: 'SfInput',
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  template:
    '<div><input data-testid="sf-input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /><slot name="prefix" /></div>',
});

const headers = [
  { title: 'File name', key: 'fileName' },
  { title: 'Path', key: 'path' },
  { title: 'Image size', key: 'size' },
  { title: 'Last change', key: 'lastModified' },
];

const buildItem = (overrides: Partial<StorageObject> = {}): StorageObject => ({
  key: 'file.jpg',
  lastModified: '2026-01-01T10:00:00Z',
  eTag: 'etag',
  size: '1000',
  storageClass: 'STANDARD',
  publicUrl: 'https://example.com/file.jpg',
  ...overrides,
});

const twelveItems = Array.from({ length: 12 }, (_, i) =>
  buildItem({
    key: `image-${String(i + 1).padStart(2, '0')}.jpg`,
    lastModified: `2026-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`,
    size: String(1000 * (i + 1)),
  }),
);

const mountImageTable = (items: StorageObject[], selectedKey: string | null = null) => {
  useItemsTableMock.mockReturnValue({
    data: ref(items),
    loading: ref(false),
    headers: ref(headers),
    bytesToMB: (bytes: string | number) => `${bytes} B`,
    formatDate: (date: string) => date,
    getStorageMetadata: getStorageMetadataMock,
  });

  return mount(UiImageTable, {
    props: { selectedKey },
    global: { stubs: { NuxtImg: true, SfInput: SfInputStub } },
  });
};

const fileNames = (wrapper: ReturnType<typeof mountImageTable>) =>
  wrapper.findAll('[data-testid="image-table-file-name"]').map((el) => el.text());

const findHeader = (wrapper: ReturnType<typeof mountImageTable>, title: string) =>
  wrapper.findAll('th').find((th) => th.text().includes(title));

describe('<ImageTable />', () => {
  beforeEach(() => {
    useItemsTableMock.mockReset();
    useImageMetadataMock.mockReset();
    useImageMetadataMock.mockReturnValue({ setMetadata: setMetadataMock });
    getStorageMetadataMock.mockReset();
    getStorageMetadataMock.mockResolvedValue(null);
    setMetadataMock.mockReset();
  });

  it('should render only the first page of rows', () => {
    const wrapper = mountImageTable(twelveItems);

    expect(fileNames(wrapper)).toHaveLength(10);
    expect(fileNames(wrapper)[0]).toBe('image-01.jpg');
  });

  it('should filter rows by search term', async () => {
    const wrapper = mountImageTable(twelveItems);

    await wrapper.find('[data-testid="sf-input-stub"]').setValue('image-05');

    expect(fileNames(wrapper)).toEqual(['image-05.jpg']);
  });

  it('should reset to page 1 when the search term changes', async () => {
    const wrapper = mountImageTable(twelveItems);

    await wrapper.find('[data-testid="image-table-pagination-next"]').trigger('click');
    expect(fileNames(wrapper)[0]).toBe('image-11.jpg');

    await wrapper.find('[data-testid="sf-input-stub"]').setValue('image-01');

    expect(wrapper.find('[data-testid="image-table-pagination-previous"]').attributes('disabled')).toBeDefined();
    expect(fileNames(wrapper)).toEqual(['image-01.jpg']);
  });

  it('should toggle sort direction on repeated header clicks', async () => {
    const wrapper = mountImageTable([buildItem({ key: 'zebra.jpg' }), buildItem({ key: 'apple.jpg' })]);

    expect(fileNames(wrapper)).toEqual(['apple.jpg', 'zebra.jpg']);

    await findHeader(wrapper, 'File name')?.trigger('click');

    expect(fileNames(wrapper)).toEqual(['zebra.jpg', 'apple.jpg']);
  });

  it('should sort by the raw numeric size value, not a lexical string comparison', async () => {
    const wrapper = mountImageTable([
      buildItem({ key: 'big-size.jpg', size: '10000000' }),
      buildItem({ key: 'small-size.jpg', size: '9000000' }),
    ]);

    await findHeader(wrapper, 'Image size')?.trigger('click');

    expect(fileNames(wrapper)).toEqual(['small-size.jpg', 'big-size.jpg']);
  });

  it('should sort by the actual date value, not the formatted display string', async () => {
    const wrapper = mountImageTable([
      buildItem({ key: 'aaa-name.jpg', lastModified: '2026-03-10T10:00:00Z' }),
      buildItem({ key: 'zzz-name.jpg', lastModified: '2026-01-05T10:00:00Z' }),
    ]);

    expect(fileNames(wrapper)).toEqual(['aaa-name.jpg', 'zzz-name.jpg']);

    await findHeader(wrapper, 'Last change')?.trigger('click');

    expect(fileNames(wrapper)).toEqual(['zzz-name.jpg', 'aaa-name.jpg']);
  });

  it('should paginate with working prev/next buttons', async () => {
    const wrapper = mountImageTable(twelveItems);
    const prev = () => wrapper.find('[data-testid="image-table-pagination-previous"]');
    const next = () => wrapper.find('[data-testid="image-table-pagination-next"]');

    expect(prev().attributes('disabled')).toBeDefined();
    expect(next().attributes('disabled')).toBeUndefined();

    await next().trigger('click');

    expect(fileNames(wrapper)).toEqual(['image-11.jpg', 'image-12.jpg']);
    expect(prev().attributes('disabled')).toBeUndefined();
    expect(next().attributes('disabled')).toBeDefined();
  });

  it('should emit select and update:selectedKey when a row is clicked', async () => {
    const item = buildItem({ key: 'clickable.jpg', publicUrl: 'https://example.com/clickable.jpg' });
    const wrapper = mountImageTable([item]);

    await wrapper.find('[data-testid="image-table-file-name"]').trigger('click');

    expect(wrapper.emitted('update:selectedKey')?.[0]).toEqual(['clickable.jpg']);
    expect(wrapper.emitted('select')?.[0]).toEqual([{ name: 'clickable.jpg', image: item.publicUrl }]);
  });

  it('should fetch storage metadata when the selectedKey prop changes', async () => {
    const wrapper = mountImageTable([buildItem({ key: 'selected.jpg' })], null);

    await wrapper.setProps({ selectedKey: 'selected.jpg' });
    await flushPromises();

    expect(getStorageMetadataMock).toHaveBeenCalledWith('selected.jpg');
  });

  it('should render a skeleton row instead of file details for uploading placeholders', () => {
    const wrapper = mountImageTable([buildItem({ key: 'uploading.jpg', storageClass: '__uploading__' })]);

    expect(wrapper.find('[data-testid="image-table-file-name"]').exists()).toBe(false);
    expect(wrapper.find('.animate-pulse').exists()).toBe(true);
  });

  it('should render an empty state when no rows match the search term', async () => {
    const wrapper = mountImageTable(twelveItems);

    await wrapper.find('[data-testid="sf-input-stub"]').setValue('no-such-file');

    expect(wrapper.text()).toContain('No images or folders found');
  });
});
