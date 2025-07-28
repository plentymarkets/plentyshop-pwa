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
      
      expect(result.stdout).toContain('PlopJS generators ready for PlentyONE Shop');
      // Expect exit code 1 since no generators are registered yet (Phase 1 - testing infrastructure only)
      expect(result.exitCode).toBe(1);
    });
  });

  describe('Command Validation', () => {
    it('should handle unknown commands gracefully', async () => {
      const result = await runCLI(['unknown-command']);
      
      expect(result.stdout).toContain('PlentyONE Shop CLI');
      expect(result.exitCode).toBe(0);
    });

    it('should accept generate command', async () => {
      // This will fail until we have generators, but tests the command parsing
      const result = await runCLI(['generate']);
      
      // Should try to run plop, even if no generators exist yet
      expect(result.stderr).toContain('No generator found');
      expect(result.exitCode).toBe(1);
    });

    it('should accept init command as alias for generate', async () => {
      const result = await runCLI(['init']);
      
      // Should try to run plop, even if no generators exist yet
      expect(result.stderr).toContain('No generator found');
      expect(result.exitCode).toBe(1);
    });
  });
});
