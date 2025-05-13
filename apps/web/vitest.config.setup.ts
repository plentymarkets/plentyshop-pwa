import { createI18n } from 'vue-i18n';
import { config } from '@vue/test-utils';
import { mockComponent, mockNuxtImport } from '@nuxt/test-utils/runtime';
import { CategoryTreeMock } from './__tests__/__mocks__/category-tree.mock';
import { ShippingCountriesMock } from './__tests__/__mocks__/shipping-countries.mock';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import { FacetMock } from './__tests__/__mocks__/facet.mock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FindTestIdPlugin = (wrapper: any) => {
  function findByTestId(testId: string) {
    return wrapper.find(`[data-testid='${testId}']`);
  }

  return {
    findByTestId,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetTestIdPlugin = (wrapper: any) => {
  function getByTestId(testId: string) {
    return wrapper.get(`[data-testid='${testId}']`);
  }

  return {
    getByTestId,
  };
};

config.plugins.VueWrapper.install(FindTestIdPlugin);
config.plugins.VueWrapper.install(GetTestIdPlugin);

const i18n = createI18n({
  legacy: false,
  fallbackWarn: false,
  missing: (_locale, key) => key,
});
config.global.plugins = [i18n];
config.global.mocks = {
  $t: (key: string) => key,
  $d: (date: Date) => date.toLocaleDateString(),
};
config.global.stubs = {
  RouterLink: true,
  NuxtImg: true,
  'i18n-t': true,
};

mockComponent('./app.vue', {
  template: `
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>`,
});

mockComponent('ClientOnly', {
  template: `<div> <slot/> </div>`,
});

mockNuxtImport('useCategoryTree', () => {
  return () => {
    return { data: computed(() => CategoryTreeMock) };
  };
});

mockNuxtImport('useActiveShippingCountries', () => {
  return () => {
    return {
      data: computed(() => ShippingCountriesMock.data),
      getActiveShippingCountries: () => {
        return vi.fn().mockResolvedValue(ShippingCountriesMock.data);
      },
    };
  };
});

export const restHandlers = [
  http.post('http://localhost:8181/plentysystems/getFacet', () => {
    return HttpResponse.json(FacetMock);
  }),
  http.get('http://localhost:8181/plentysystems/*', () => {
    return HttpResponse.json([]);
  }),
  http.post('http://localhost:8181/plentysystems/*', () => {
    return HttpResponse.json([]);
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

vi.resetModules();
