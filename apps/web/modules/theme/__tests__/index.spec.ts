import type { Component, NuxtPage } from '@nuxt/schema';
import themeModule from '../index';

const { extendPagesMock } = vi.hoisted(() => ({
  extendPagesMock: vi.fn(),
}));

vi.mock('nuxt/kit', () => ({
  createResolver: () => ({
    resolve: (path: string) => path,
  }),
  defineNuxtModule: (moduleDefinition: unknown) => moduleDefinition,
  extendPages: extendPagesMock,
}));

type ComponentsExtendHook = (components: Component[]) => void;

const setupModule = () => {
  const hooks: Record<string, ComponentsExtendHook> = {};
  const nuxt = {
    hook: (name: string, handler: ComponentsExtendHook) => {
      hooks[name] = handler;
    },
  };
  (themeModule as unknown as { setup: (options: unknown, nuxt: unknown) => void }).setup({}, nuxt);
  return hooks;
};

const runExtendPages = (pages: NuxtPage[]) => {
  setupModule();
  const callback = extendPagesMock.mock.calls[0]![0] as (pages: NuxtPage[]) => void;
  callback(pages);
  return pages;
};

const runComponentsExtend = (components: Component[]) => {
  const hooks = setupModule();
  hooks['components:extend']!(components);
  return components;
};

const createComponent = (pascalName: string) =>
  ({ pascalName, filePath: `app/components/${pascalName}/${pascalName}.vue` }) as Component;

describe('theme module', () => {
  beforeEach(() => {
    extendPagesMock.mockClear();
  });

  it('should replace the checkout page with the theme checkout page', () => {
    const pages = runExtendPages([{ name: 'checkout', path: '/checkout', file: 'app/pages/checkout.vue' }]);

    expect(pages[0]!.file).toBe('./runtime/pages/checkout.vue');
  });

  it('should leave other pages untouched', () => {
    const pages = runExtendPages([{ name: 'cart', path: '/cart', file: 'app/pages/cart.vue' }]);

    expect(pages[0]!.file).toBe('app/pages/cart.vue');
  });

  it.each(['AddressFormShipping', 'AddressFormBilling'])('should replace %s with the theme component', (name) => {
    const components = runComponentsExtend([createComponent(name)]);

    expect(components[0]!.filePath).toBe(`./runtime/components/${name}/${name}.vue`);
  });

  it('should leave other components untouched', () => {
    const components = runComponentsExtend([createComponent('UiButton')]);

    expect(components[0]!.filePath).toBe('app/components/UiButton/UiButton.vue');
  });
});
