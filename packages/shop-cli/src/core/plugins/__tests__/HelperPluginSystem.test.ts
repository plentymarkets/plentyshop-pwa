import { describe, it, expect, vi } from 'vitest';
import { BaseHelperPlugin } from '../index';
import type { NodePlopAPI } from 'plop';

// Mock plop instance
const createMockPlop = (): NodePlopAPI => {
  return {
    setHelper: vi.fn(),
    // Add other required methods as needed
  } as unknown as NodePlopAPI;
};

// Test plugin implementation
class TestPlugin extends BaseHelperPlugin {
  readonly name = 'test-plugin';
  readonly description = 'Test plugin for unit testing';
  readonly version = '1.0.0';
  readonly helpers = ['testHelper'];

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'testHelper', () => 'test-result');
  }
}

describe('HelperPluginSystem', () => {
  describe('BaseHelperPlugin', () => {
    it('should have abstract properties and methods implemented', () => {
      const plugin = new TestPlugin();

      expect(plugin.name).toBe('test-plugin');
      expect(plugin.description).toBe('Test plugin for unit testing');
      expect(plugin.version).toBe('1.0.0');
      expect(plugin.helpers).toEqual(['testHelper']);
      expect(plugin.validate()).toBe(true);
    });

    it('should register helpers safely', () => {
      const plugin = new TestPlugin();
      const mockPlop = createMockPlop();

      plugin.register(mockPlop);

      expect(mockPlop.setHelper).toHaveBeenCalledWith('testHelper', expect.any(Function));
    });

    it('should handle registration errors gracefully', () => {
      const plugin = new TestPlugin();
      const mockPlop = {
        setHelper: vi.fn().mockImplementation(() => {
          throw new Error('Registration failed');
        }),
      } as unknown as NodePlopAPI;

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.register(mockPlop);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[test-plugin] Failed to register helper 'testHelper':",
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});
