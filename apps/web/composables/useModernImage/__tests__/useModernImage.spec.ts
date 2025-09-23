import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useModernImage } from '../useModernImage';

const { useRuntimeConfig } = vi.hoisted(() => {
  return {
    useRuntimeConfig: vi.fn().mockImplementation(() => {
      return {};
    }),
  };
});

mockNuxtImport('useRuntimeConfig', () => {
  return useRuntimeConfig;
});

describe('useModernImage with only webp enabled', () => {
  beforeEach(() => {
    useRuntimeConfig.mockImplementation(() => {
      return {
        public: {
          useAvif: false,
          useWebp: true,
        },
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should add the webp extension to the url', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.jpg.webp');
  });

  it('should not add the webp extension to the url if the url has no /item/images/ in it', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/images/image.jpg');
  });

  it('should not add the webp extension to the url if the base extension is already webp', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.webp';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.webp');
  });
});

describe('useModernImage with webp and avif enabled', () => {
  beforeEach(() => {
    useRuntimeConfig.mockImplementation(() => {
      return {
        public: {
          useAvif: true,
          useWebp: true,
        },
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add the avif extension to the url', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'true' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.jpg.avif');
  });

  it('should not add the avif extension to the url if the base extension is already avif', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'true' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.avif';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.avif');
  });

  it('should not add the avif extension to the url if the url has no /item/images/ in it', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'true' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/images/image.jpg');
  });

  it('should not add the avif extension to the url if the base extension is not supported', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'true' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.svg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.svg');
  });

  it('should add the avif extension to the url if both avif and webp are enabled', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'true' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'true' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.jpg.avif');
  });
});

describe('useModernImage with webp and avif disabled', () => {
  beforeEach(() => {
    useRuntimeConfig.mockImplementation(() => {
      return {
        public: {
          useAvif: false,
          useWebp: false,
        },
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not add any extension to the url', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'false' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.png';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.png');
  });

  it('should not add any extension to the url if the url has no /item/images/ in it', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'false' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/images/image.jpg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/images/image.jpg');
  });

  it('should not add any extension to the url if the base extension is not supported', () => {
    const { setInitialData } = useSiteSettings();
    setInitialData([
      { key: 'useAvif', originalKey: 'useAvif', value: 'false' },
      { key: 'useWebp', originalKey: 'useWebp', value: 'false' },
    ]);

    const { addModernImageExtension } = useModernImage();
    const url = 'https://example.com/item/images/image.svg';
    const res = addModernImageExtension(url);
    expect(res).toBe('https://example.com/item/images/image.svg');
  });
});
