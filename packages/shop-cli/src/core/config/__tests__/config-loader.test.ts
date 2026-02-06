import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { findConfigFile, loadConfig, resolveConfig, validatePath } from '../config-loader';

describe('Config Loader', () => {
  const testDir = join(process.cwd(), '__tests__', 'fixtures', 'config-test');
  const configDir = join(testDir, '.plentyone');
  const configPath = join(configDir, 'shop-cli.json');

  beforeEach(() => {
    // Clean up and create test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });
    mkdirSync(configDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('findConfigFile', () => {
    it('should find config file in current directory', () => {
      writeFileSync(configPath, '{}');
      const found = findConfigFile(testDir);
      expect(found).toBe(configPath);
    });

    it('should find config file in parent directory', () => {
      writeFileSync(configPath, '{}');
      const subDir = join(testDir, 'subdir');
      mkdirSync(subDir);
      const found = findConfigFile(subDir);
      expect(found).toBe(configPath);
    });

    it('should return null if config file not found', () => {
      const found = findConfigFile(testDir);
      expect(found).toBeNull();
    });
  });

  describe('loadConfig', () => {
    it('should load valid JSON config', () => {
      const config = { webAppPath: 'custom/path' };
      writeFileSync(configPath, JSON.stringify(config));
      const loaded = loadConfig(configPath);
      expect(loaded).toEqual(config);
    });

    it('should return empty object for invalid JSON', () => {
      writeFileSync(configPath, 'invalid json {');
      const loaded = loadConfig(configPath);
      expect(loaded).toEqual({});
    });

    it('should return empty object for non-existent file', () => {
      const loaded = loadConfig('/non/existent/path');
      expect(loaded).toEqual({});
    });
  });

  describe('resolveConfig', () => {
    it('should use default config when no config file or CLI flags', () => {
      const config = resolveConfig();
      expect(config.webAppPath).toBe('apps/web/app');
    });

    it('should prioritize CLI flags over config file', () => {
      writeFileSync(configPath, JSON.stringify({ webAppPath: 'from/config' }));
      const originalCwd = process.cwd();
      process.chdir(testDir);

      const config = resolveConfig({ webAppPath: 'from/cli' });
      expect(config.webAppPath).toBe('from/cli');

      process.chdir(originalCwd);
    });

    it('should use config file when no CLI flags', () => {
      writeFileSync(configPath, JSON.stringify({ webAppPath: 'from/config' }));
      const originalCwd = process.cwd();
      process.chdir(testDir);

      const config = resolveConfig();
      expect(config.webAppPath).toBe('from/config');

      process.chdir(originalCwd);
    });

    it('should use defaults when config file has partial config', () => {
      writeFileSync(configPath, JSON.stringify({}));
      const originalCwd = process.cwd();
      process.chdir(testDir);

      const config = resolveConfig();
      expect(config.webAppPath).toBe('apps/web/app');

      process.chdir(originalCwd);
    });
  });

  describe('validatePath', () => {
    it('should return true for existing path', () => {
      const validPath = 'valid-dir';
      mkdirSync(join(testDir, validPath));
      const result = validatePath(testDir, validPath);
      expect(result).toBe(true);
    });

    it('should return false for non-existent path', () => {
      const result = validatePath(testDir, 'non-existent');
      expect(result).toBe(false);
    });

    it('should handle absolute paths correctly', () => {
      const validPath = 'valid-dir';
      mkdirSync(join(testDir, validPath));
      const result = validatePath(testDir, validPath);
      expect(result).toBe(true);
    });
  });
});
