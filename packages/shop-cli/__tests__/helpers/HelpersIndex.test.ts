import { describe, it, expect, vi } from 'vitest';
import { registerDefaultHelpers, createHelperManager } from '../../src/helpers';
import type { NodePlopAPI } from 'plop';

// Mock plop instance
const createMockPlop = (): NodePlopAPI => {
  return {
    setHelper: vi.fn(),
  } as unknown as NodePlopAPI;
};

describe('Helpers Index', () => {
  describe('registerDefaultHelpers', () => {
    it('should register all default helpers', () => {
      const mockPlop = createMockPlop();

      registerDefaultHelpers(mockPlop);

      // Verify that helpers were registered
      expect(mockPlop.setHelper).toHaveBeenCalledWith('pascalCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('camelCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('kebabCase', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('composableBaseName', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('makeComposableName', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('testId', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('currentDate', expect.any(Function));
      expect(mockPlop.setHelper).toHaveBeenCalledWith('currentYear', expect.any(Function));
    });

    it('should handle verbose mode', () => {
      const mockPlop = createMockPlop();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      registerDefaultHelpers(mockPlop, true);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Helper System] Registered'));

      consoleSpy.mockRestore();
    });
  });

  describe('createHelperManager', () => {
    it('should create a manager with default plugins', () => {
      const manager = createHelperManager();

      expect(manager.getPluginNames()).toContain('string-case');
      expect(manager.getPluginNames()).toContain('composable');
      expect(manager.getPluginNames()).toContain('utility');
    });

    it('should create a manager without defaults when specified', () => {
      const manager = createHelperManager({ includeDefaults: false });

      expect(manager.getPluginNames()).toHaveLength(0);
    });

    it('should pass configuration options', () => {
      const manager = createHelperManager({
        verbose: true,
        failOnError: true,
      });

      // The manager should be configured with these options
      expect(manager).toBeDefined();
    });
  });
});
