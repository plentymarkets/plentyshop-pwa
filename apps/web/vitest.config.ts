import { defineVitestConfig } from '@nuxt/test-utils/config';
import { coverageConfigDefaults } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const silenceLogsFromSuspenseComponent = (log: string): boolean => {
  return log.includes('<Suspense');
};

export default defineVitestConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'json'],
      reportsDirectory: fileURLToPath(new URL('./coverage', import.meta.url)),
      exclude: [...coverageConfigDefaults.exclude, 'assets/**', 'build/**'],
      reportOnFailure: true,
      thresholds: {
        lines: 50, // target 80
        statements: 50, // target 80
        functions: 80, // target 80
        branches: 80, // target 90
      },
    },
    testTimeout: 6000,
    environment: 'nuxt',
    globals: true,
    clearMocks: true,
    setupFiles: './vitest.config.setup.ts',
    include: ['**/*/?(*.)+(spec|test).[jt]s'],
    onConsoleLog: (log: string): boolean | undefined => {
      if (silenceLogsFromSuspenseComponent(log)) {
        return false;
      }
    },
  },
});
