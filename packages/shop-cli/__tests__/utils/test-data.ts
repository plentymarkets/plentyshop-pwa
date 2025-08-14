/**
 * Test data and patterns
 * Common mock data and expected patterns used across tests
 */

/**
 * Mock generator data for testing
 */
export const mockGeneratorData = {
  component: {
    name: 'TestComponent',
    description: 'A test component for validation',
    path: 'components/TestComponent',
  },

  composable: {
    name: 'useTestData',
    description: 'A test composable for validation',
    path: 'composables/useTestData',
  },
};

/**
 * Expected file patterns for different generator types
 */
export const expectedFilePatterns = {
  component: ['index.vue', 'types.ts', '__tests__/index.test.ts'],

  composable: ['useTestData.ts', 'types.ts', 'index.ts', '__tests__/useTestData.spec.ts'],
};
