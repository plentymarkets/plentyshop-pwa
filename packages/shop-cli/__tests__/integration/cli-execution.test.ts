/**
 * Integration tests for CLI command execution
 * Tests the actual CLI binary and command parsing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { runCLI, createTempTestDirectory, cleanupTestDirectory } from '../utils';

describe('CLI Command Execution', () => {
  let testDir: string;
  
  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = await createTempTestDirectory();
  });

  afterEach(async () => {
    // Clean up test directory
    await cleanupTestDirectory(testDir);
  });

  describe('Help Command', () => {
    it('should display help when --help flag is used', async () => {
      const result = await runCLI(['--help']);
      
      expect(result.stdout).toContain('PlentyONE Shop CLI');
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('plentyshop generate');
      expect(result.stdout).toContain('plentyshop init');
      expect(result.exitCode).toBe(0);
    });

    it('should display help when no arguments are provided', async () => {
      const result = await runCLI([]);
      
      expect(result.stdout).toContain('PlentyONE Shop CLI');
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('plentyshop generate');
      expect(result.exitCode).toBe(0);
    });
  });

  describe('Command Validation', () => {
    it('should handle unknown commands gracefully', async () => {
      const result = await runCLI(['unknown-command']);
      
      expect(result.stdout).toContain('PlentyONE Shop CLI');
      expect(result.exitCode).toBe(0);
    });

    it('should accept generate command and show available generators', async () => {
      // This test has a longer timeout since it launches the interactive generator selection
      const result = await runCLI(['generate']);
      
      // Should launch plop interactive interface and show our generators
      expect(result.stdout).toContain('Loading PlentyONE Shop generators');
      expect(result.stdout).toContain('Component generator loaded successfully!');
      expect(result.stdout).toContain('UI Component generator loaded successfully!');
      expect(result.stdout).toContain('[PLOP] Please choose a generator');
      expect(result.stdout).toContain('component - Generate a Vue component');
      expect(result.stdout).toContain('ui-component - Generate a UI component');
    }, 10000);  // 10 second timeout for interactive command

    it('should initialize CLI and show help with init command', async () => {
      const result = await runCLI(['init']);
      
      // Should show initialization message and help
      expect(result.stdout).toContain('PlentyONE Shop CLI initialized successfully!');
      expect(result.stdout).toContain('Usage:');
      expect(result.stdout).toContain('plentyshop generate');
      expect(result.exitCode).toBe(0);
    });
  });
});
