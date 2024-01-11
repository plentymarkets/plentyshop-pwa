import { defineVitestConfig } from '@nuxt/test-utils/config';

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
      // Silence logs coming from vue <Suspense> is experimental, and stdout | unknown component before it
      if (log.includes('<Suspense')) return false;
      return log;
    },
  },
});
