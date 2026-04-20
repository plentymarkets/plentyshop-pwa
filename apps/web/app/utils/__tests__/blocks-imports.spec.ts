import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCachedBlockComponent, blockLoaders } from '../blocks-imports';

describe('blocks-import getCachedBlockComponent', () => {
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
});
