import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HelperPluginManager, BaseHelperPlugin } from '../index';
import type { NodePlopAPI } from 'plop';

const createMockPlop = (): NodePlopAPI => {
  return {
    setHelper: vi.fn(),
  } as unknown as NodePlopAPI;
};

class TestPlugin extends BaseHelperPlugin {
  readonly name = 'test-plugin';
  readonly description = 'Test plugin for unit testing';
  readonly version = '1.0.0';
  readonly helpers = ['testHelper'];

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'testHelper', () => 'test-result');
  }
}

class FailingPlugin extends BaseHelperPlugin {
  readonly name = 'failing-plugin';
  readonly description = 'Plugin that fails validation';
  readonly version = '1.0.0';
  readonly helpers = ['failingHelper'];

  validate(): boolean {
    return false;
  }

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'failingHelper', () => 'should-not-register');
  }
}

class InitPlugin extends BaseHelperPlugin {
  readonly name = 'init-plugin';
  readonly description = 'Plugin with initialization';
  readonly version = '1.0.0';
  readonly helpers = ['initHelper'];

  private initialized = false;

  init(config?: Record<string, unknown>): void {
    this.initialized = true;
    if (config?.test) {
      // Test initialization with config
    }
  }

  register(plop: NodePlopAPI): void {
    this.safeRegister(plop, 'initHelper', () => (this.initialized ? 'initialized' : 'not-initialized'));
  }
}

describe('HelperPluginManager', () => {
  let manager: HelperPluginManager;
  let mockPlop: NodePlopAPI;

  beforeEach(() => {
    manager = new HelperPluginManager();
    mockPlop = createMockPlop();
  });

  it('should register plugins successfully', () => {
    const plugin = new TestPlugin();

    manager.register(plugin);

    expect(manager.getPluginNames()).toContain('test-plugin');
    expect(manager.getPlugin('test-plugin')).toBe(plugin);
  });

  it('should handle duplicate plugin registration', () => {
    const plugin1 = new TestPlugin();
    const plugin2 = new TestPlugin();

    manager.register(plugin1);
    manager.register(plugin2);

    expect(manager.getPluginNames()).toEqual(['test-plugin']);
    expect(manager.getPlugin('test-plugin')).toBe(plugin1);
  });

  it('should register multiple plugins', () => {
    const plugin1 = new TestPlugin();
    const plugin2 = new InitPlugin();

    manager.registerAll([plugin1, plugin2]);

    expect(manager.getPluginNames()).toEqual(['test-plugin', 'init-plugin']);
  });

  it('should handle plugin validation failure', () => {
    const plugin = new FailingPlugin();
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    manager.register(plugin);

    expect(manager.getPluginNames()).not.toContain('failing-plugin');
    expect(consoleSpy).toHaveBeenCalledWith("[HelperPluginManager] Plugin 'failing-plugin' failed validation");

    consoleSpy.mockRestore();
  });

  it('should initialize plugins with config', () => {
    const plugin = new InitPlugin();
    const managerWithConfig = new HelperPluginManager({
      globalConfig: { test: true },
    });

    managerWithConfig.register(plugin);
    managerWithConfig.applyTo(mockPlop);

    expect(mockPlop.setHelper).toHaveBeenCalledWith('initHelper', expect.any(Function));
  });

  it('should apply all plugins to plop instance', () => {
    const plugin1 = new TestPlugin();
    const plugin2 = new InitPlugin();

    manager.register(plugin1).register(plugin2);
    manager.applyTo(mockPlop);

    expect(mockPlop.setHelper).toHaveBeenCalledWith('testHelper', expect.any(Function));
    expect(mockPlop.setHelper).toHaveBeenCalledWith('initHelper', expect.any(Function));
    expect(manager.getRegisteredHelpers()).toEqual(['testHelper', 'initHelper']);
  });

  it('should track registered helpers', () => {
    const plugin = new TestPlugin();

    manager.register(plugin);
    manager.applyTo(mockPlop);

    expect(manager.hasHelper('testHelper')).toBe(true);
    expect(manager.hasHelper('nonExistentHelper')).toBe(false);
    expect(manager.getRegisteredHelpers()).toEqual(['testHelper']);
  });

  it('should provide summary information', () => {
    const plugin1 = new TestPlugin();
    const plugin2 = new InitPlugin();

    manager.register(plugin1).register(plugin2);
    manager.applyTo(mockPlop);

    const summary = manager.getSummary();

    expect(summary.pluginCount).toBe(2);
    expect(summary.helperCount).toBe(2);
    expect(summary.plugins).toHaveLength(2);
    expect(summary.plugins[0]).toEqual({
      name: 'test-plugin',
      version: '1.0.0',
      description: 'Test plugin for unit testing',
      helpers: ['testHelper'],
    });
  });

  it('should handle verbose logging', () => {
    const verboseManager = new HelperPluginManager({ verbose: true });
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    verboseManager.register(new TestPlugin());
    verboseManager.applyTo(mockPlop);

    expect(consoleSpy).toHaveBeenCalledWith("[HelperPluginManager] Registered plugin 'test-plugin' v1.0.0");
    expect(consoleSpy).toHaveBeenCalledWith("[HelperPluginManager] Applied plugin 'test-plugin' (1 helpers)");
    expect(consoleSpy).toHaveBeenCalledWith('[HelperPluginManager] Applied 1 plugins, registered 1 helpers');

    consoleSpy.mockRestore();
  });

  it('should handle application errors gracefully', () => {
    const plugin = new TestPlugin();
    plugin.register = vi.fn().mockImplementation(() => {
      throw new Error('Application failed');
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    manager.register(plugin);
    manager.applyTo(mockPlop);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[HelperPluginManager] Failed to apply plugin 'test-plugin': Error: Application failed",
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle failOnError configuration', () => {
    const strictManager = new HelperPluginManager({ failOnError: true });
    const plugin = new FailingPlugin();

    expect(() => strictManager.register(plugin)).toThrow("Plugin 'failing-plugin' failed validation");
  });

  it('should clear all plugins and helpers', () => {
    const plugin = new TestPlugin();

    manager.register(plugin);
    manager.applyTo(mockPlop);

    expect(manager.getPluginNames()).toHaveLength(1);
    expect(manager.getRegisteredHelpers()).toHaveLength(1);

    manager.clear();

    expect(manager.getPluginNames()).toHaveLength(0);
    expect(manager.getRegisteredHelpers()).toHaveLength(0);
  });
});
