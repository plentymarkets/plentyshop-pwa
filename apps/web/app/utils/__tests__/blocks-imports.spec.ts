import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { getCachedBlockComponent, blockLoaders } from '../blocks-imports';

const { useNuxtApp } = vi.hoisted(() => ({
    useNuxtApp: vi.fn(),
}));

mockNuxtImport('useNuxtApp', () => useNuxtApp);

describe('blocks-import getCachedBlockComponent', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mockNuxtApp: Record<string, any>;

    beforeEach(() => {
        mockNuxtApp = {};
        useNuxtApp.mockReturnValue(mockNuxtApp);
    });

    afterEach(() => {
        delete blockLoaders['TestBlock'];
        delete blockLoaders['CachedBlock'];
    });

    it('should return null when no loader exists for the given name', () => {
        const result = getCachedBlockComponent('NonExistentBlock');

        expect(result).toBeNull();
    });

    it('should return a component when a loader exists for the given name', () => {
        blockLoaders['TestBlock'] = vi.fn().mockResolvedValue({});

        const result = getCachedBlockComponent('TestBlock');

        expect(result).not.toBeNull();
    });

    it('should return the same cached instance on subsequent calls', () => {
        blockLoaders['CachedBlock'] = vi.fn().mockResolvedValue({});

        const first = getCachedBlockComponent('CachedBlock');
        const second = getCachedBlockComponent('CachedBlock');

        expect(first).toBe(second);
    });

    it('should store the component in the nuxtApp cache', () => {
        blockLoaders['TestBlock'] = vi.fn().mockResolvedValue({});

        getCachedBlockComponent('TestBlock');

        expect(mockNuxtApp._blockComponentCache).toBeDefined();
        expect(mockNuxtApp._blockComponentCache['TestBlock']).toBeDefined();
    });
});
