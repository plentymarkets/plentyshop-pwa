import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { StorageObject } from '@plentymarkets/shop-api';
import {
  extractFolders,
  createPlaceholderObject,
  removeByKeyFromArray,
  buildItemHelper,
} from '../helpers/itemTableHelpers';
const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn().mockReturnValue({
      plentysystems: {
        getStorageItems: vi.fn().mockResolvedValue({ data: [] }),
        doUploadStorageItem: vi
          .fn()
          .mockResolvedValue({ data: { key: 'uploaded.png', size: '123', publicUrl: 'url' } }),
        getStorageMetadata: vi.fn().mockResolvedValue({ data: {} }),
      },
    }),
  };
});

const send = vi.fn();
mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useNotification', () => () => ({ send }));

vi.mock('../useItemTable', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...(mod as object),
    fileToBase64: vi.fn().mockResolvedValue('base64string'),
  };
});

describe('useItemsTable', () => {
  it('should use all expected image types in getStorageItems default fileTypes', async () => {
    const { getStorageItems } = (await import('../useItemTable')).useItemsTable();

    await getStorageItems();

    const mockGetStorageItems = useSdk().plentysystems.getStorageItems as ReturnType<typeof vi.fn>;

    expect(mockGetStorageItems).toHaveBeenCalledWith(
      expect.objectContaining({
        fileTypes: 'png,jpg,jpeg,avif,webp,svg,ico',
        includeFolders: 'true',
      }),
    );

    const expectedTypes = ['png', 'jpg', 'jpeg', 'avif', 'webp', 'svg', 'ico'];
    const calledFileTypes = mockGetStorageItems.mock.calls[0]?.[0]?.fileTypes?.replace(/\s/g, '').split(',');

    expectedTypes.forEach((type) => {
      expect(calledFileTypes).toContain(type);
    });
  });

  it('should return all unique folder paths from a list of StorageObjects', () => {
    const items: StorageObject[] = [
      { key: 'folder1/image1.png' } as StorageObject,
      { key: 'folder1/image2.jpg' } as StorageObject,
      { key: 'folder2/subfolder/image3.webp' } as StorageObject,
      { key: 'folder2/subfolder/image4.png' } as StorageObject,
      { key: 'folder3/' } as StorageObject,
      { key: 'image5.png' } as StorageObject,
    ];

    const result = extractFolders(items);

    expect(result).toEqual(expect.arrayContaining(['folder1', 'folder2/subfolder', 'folder3']));
    expect(result).not.toContain('');
    expect(result.length).toBe(3);
  });

  it('should revoke all blob URLs and clear the pendingBlobUrls state', async () => {
    const { registerBlobUrl, revokeAllBlobUrls } = (await import('../useItemTable')).useItemsTable();
    const pendingBlobUrls = useState<string[]>('pending-blob-urls');

    pendingBlobUrls.value = [];
    registerBlobUrl('blob:url-1');
    registerBlobUrl('blob:url-2');

    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    revokeAllBlobUrls();

    expect(revokeSpy).toHaveBeenCalledTimes(2);
    expect(revokeSpy).toHaveBeenCalledWith('blob:url-1');
    expect(revokeSpy).toHaveBeenCalledWith('blob:url-2');
    expect(pendingBlobUrls.value).toEqual([]);

    revokeSpy.mockRestore();
  });

  it('should create a placeholder StorageObject with correct fields', () => {
    const key = 'test-key';
    const size = 12345;
    const uploadingClass = '__uploading__';

    const result = createPlaceholderObject(key, size, uploadingClass);

    expect(result).toMatchObject({
      key: 'test-key',
      eTag: '',
      size: '12345',
      storageClass: '__uploading__',
      publicUrl: '',
      previewUrl: '',
    });
    expect(typeof result.lastModified).toBe('string');
    expect(new Date(result.lastModified).toString()).not.toBe('Invalid Date');
  });

  it('should remove all items with the given key', () => {
    const arr = [{ key: 'a' }, { key: 'b' }, { key: 'a' }, { key: 'c' }] as StorageObject[];
    const result = removeByKeyFromArray(arr, 'a');
    expect(result).toEqual([{ key: 'b' }, { key: 'c' }]);
  });
  it('should correctly convert bytes (as string or number) to a formatted MB string', async () => {
    const { bytesToMB } = (await import('../useItemTable')).useItemsTable();

    expect(bytesToMB(1048576)).toBe('1.00 MB');
    expect(bytesToMB('2097152')).toBe('2.00 MB');
    expect(bytesToMB(0)).toBe('0.00 MB');
    expect(bytesToMB('0')).toBe('0.00 MB');
    expect(bytesToMB(524288)).toBe('0.50 MB');
    expect(bytesToMB('1572864')).toBe('1.50 MB');
  });

  it('should validate the file and show a notification if invalid', async () => {
    const { uploadStorageItem } = (await import('../useItemTable')).useItemsTable();

    const file = new File([''], 'invalid.txt', { type: 'text/plain' });
    const result = await uploadStorageItem(file, '');

    expect(send).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Only SVG, PNG, JPG, JPEG, WEBP, AVIF, ICO files are allowed.',
    });
    expect(result).toBeNull();
  });

  it('should build a StorageObject and register a blob URL if needed', () => {
    const registerBlobUrl = vi.fn();
    const api = { key: 'api-key', size: '123' };
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });

    const objectUrl = 'blob:mock-url';
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue(objectUrl);

    const result = buildItemHelper(api, file, registerBlobUrl);

    expect(result.publicUrl).toBe(objectUrl);
    expect(registerBlobUrl).toHaveBeenCalledWith(objectUrl);

    createObjectURLSpy.mockRestore();
  });
});
