import { defineVitestConfig } from '@nuxt/test-utils/config';

const silenceLogsFromSuspenseComponent = (log: string): boolean => {
  return log.includes('<Suspense');
};

export default defineVitestConfig({
  test: {
    coverage: {
      reporter: ['text', 'html', 'json-summary', 'json'],
    },
    environment: 'nuxt',
    globals: true,
    clearMocks: true,
    setupFiles: './vitest.config.setup.ts',
    include: ['**/*/?(*.)+(spec|test).[jt]s'],
    onConsoleLog: (log): any => {
      if (silenceLogsFromSuspenseComponent(log)) {
        return false;
      }
      return log;
    },
  },
});
