import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    coverage: {
      reporter: ['text', 'html', 'json-summary', 'json'],
    },
    environment: 'nuxt',
    globals: true,
    clearMocks: true,
    setupFiles: './vue-test-utils.extend.js',
    include: ['**/*/?(*.)+(spec|test).[jt]s'],
    onConsoleLog: (log): any => {
      // Silence logs coming from vue <Suspense> is experimental, and stdout | unknown component before it
      if (log.includes('<Suspense')) return false;
      return log;
    },
  }
})