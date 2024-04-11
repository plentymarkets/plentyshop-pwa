// write a test for the addModernImageExtension function

import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useModernImage } from "../useModernImage";

describe('useModernImage', () => {

    const { useRuntimeConfig } = vi.hoisted(() => {
        return {
            useRuntimeConfig: vi.fn().mockImplementation(() => {
                return {
                    public: {
                        useAvif: true,
                        useWebp: true
                    }
                }
            })
        }
    });

    mockNuxtImport('useRuntimeConfig', () => {
        return useRuntimeConfig
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should add the avif extension to the url', () => {
        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.jpg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.jpg.avif');
    });

    it('should add the webp extension to the url', () => {

        useRuntimeConfig.mockImplementation(() => {
            return {
                public: {
                    useAvif: false,
                    useWebp: true
                }
            }
        });

        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.jpg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.jpg.webp');
    });

    it('should not add the webp extension to the url if the url has no /item/images/ in it', () => {

        useRuntimeConfig.mockImplementation(() => {
            return {
                public: {
                    useAvif: false,
                    useWebp: true
                }
            }
        });

        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/images/image.jpg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/images/image.jpg');
    });

    it('should not add the webp extension to the url if the base extension is already webp', () => {

        useRuntimeConfig.mockImplementation(() => {
            return {
                public: {
                    useAvif: false,
                    useWebp: true
                }
            }
        });

        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.webp';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.webp');
    });

    it('should not add the avif extension to the url if the base extension is already avif', () => {
        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.avif';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.avif');
    });

    it('should not add the avif extension to the url if the url has no /item/images/ in it', () => {
        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/images/image.jpg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/images/image.jpg');
    });
    
    it('should not add the avif extension to the url if the base extension is not supported', () => {
        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.svg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.svg');
    });

    it('should add the avif extension to the url if both avif and webp are enabled', () => {
        const { addModernImageExtension } = useModernImage();
        const url = 'https://example.com/item/images/image.jpg';
        const res = addModernImageExtension(url);
        expect(res).toBe('https://example.com/item/images/image.jpg.avif');
    });

});