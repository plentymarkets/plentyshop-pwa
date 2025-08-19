/**
 * CLI testing helper functions
 * Utilities for running and testing CLI commands
 */

import { spawn } from 'child_process';
import { join } from 'path';
import { setTimeout } from 'timers';

/**
 * CLI execution result interface
 */
export interface CLIResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Helper function to run CLI commands and capture output
 */
export async function runCLI(args: string[]): Promise<CLIResult> {
  return new Promise((resolve) => {
    const cliPath = join(__dirname, '../../bin/plentyshop.js');
    const child = spawn('node', [cliPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    if (args.includes('generate')) {
      setTimeout(() => {
        child.stdin.write('\x03'); // Ctrl+C
        child.stdin.end();
      }, 100);
    }

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code || 0,
      });
    });
  });
}

/**
 * Common test patterns for CLI output validation
 */
export const cliOutputPatterns = {
  help: ['PlentyONE Shop CLI', 'Usage:'],
  generatorCommands: ['plentyshop generate', 'plentyshop init'],
  plopMessage: ['PlopJS generators ready for PlentyONE Shop'],
  noGeneratorError: ['No generator found'],
};
