import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ModuleOptions } from '../index';
import type { NuxtPage } from '@nuxt/schema';
import type { NitroConfig } from 'nitropack/types';
import sitemapModule from '../index';

const { addServerHandlerMock } = vi.hoisted(() => ({
  addServerHandlerMock: vi.fn(),
}));

vi.mock('nuxt/kit', () => ({
  addServerHandler: addServerHandlerMock,
  createResolver: () => ({
    resolve: (path: string) => path,
  }),
  defineNuxtModule: (moduleDefinition: unknown) => moduleDefinition,
}));

type HookPayloadMap = {
  'pages:resolved': NuxtPage[];
  'nitro:config': NitroConfig;
};

type HookName = keyof HookPayloadMap;
type PagesResolvedHook = (payload: NuxtPage[]) => void;
type NitroConfigHook = (payload: NitroConfig) => void;
type HookHandler = PagesResolvedHook | NitroConfigHook;

type NuxtMock = {
  hook: <K extends HookName>(name: K, handler: (payload: HookPayloadMap[K]) => void) => void;
  options: {
    runtimeConfig: {
      public: Record<string, unknown>;
    };
  };
};

const createNuxtMock = () => {
  const hooks: {
    'pages:resolved'?: PagesResolvedHook;
    'nitro:config'?: NitroConfigHook;
  } = {};

  const nuxt = {
    hook: vi.fn((name: HookName, handler: HookHandler) => {
      if (name === 'pages:resolved') {
        hooks['pages:resolved'] = handler as PagesResolvedHook;
        return;
      }

      hooks['nitro:config'] = handler as NitroConfigHook;
    }),
    options: {
      runtimeConfig: {
        public: {},
      },
    },
  } satisfies NuxtMock;

  return { nuxt, hooks };
};

const setupSitemapModule = (options: ModuleOptions, nuxt: NuxtMock): void => {
  (sitemapModule as unknown as { setup: (moduleOptions: ModuleOptions, moduleNuxt: NuxtMock) => void }).setup(
    options,
    nuxt,
  );
};

describe('sitemap module', () => {
  beforeEach(() => {
    addServerHandlerMock.mockClear();
  });

  it('should keep only customer-facing pages in the sitemap list', () => {
    const { nuxt, hooks } = createNuxtMock();

    setupSitemapModule({ exclude: ['/hidden*'] }, nuxt);

    hooks['pages:resolved']?.([
      { path: '/contact' },
      { path: '/product/:id' },
      { path: '/__tests__/shipping.spec' },
      { path: '/sample.test' },
      { path: '/hidden-preview' },
      { path: '/privacy', meta: { sitemap: false } },
    ]);

    const nitroConfig: NitroConfig = { virtual: {} };
    hooks['nitro:config']?.(nitroConfig);

    const virtualSitemapLoader = nitroConfig.virtual?.['#sitemap-data'];
    const virtualSitemapData = typeof virtualSitemapLoader === 'function' ? virtualSitemapLoader() : '';

    expect(virtualSitemapData).toContain('"/contact"');
    expect(virtualSitemapData).not.toContain('"/product/:id"');
    expect(virtualSitemapData).not.toContain('"/__tests__/shipping.spec"');
    expect(virtualSitemapData).not.toContain('"/sample.test"');
    expect(virtualSitemapData).not.toContain('"/hidden-preview"');
    expect(virtualSitemapData).not.toContain('"/privacy"');
  });

  it('should use human-safe defaults when sitemap options are not provided', () => {
    const { nuxt } = createNuxtMock();

    setupSitemapModule({}, nuxt);

    expect(
      (
        nuxt.options.runtimeConfig.public as {
          plentySitemap?: {
            defaultLocale: string;
            locales: string[];
          };
        }
      ).plentySitemap,
    ).toEqual({
      defaultLocale: 'en',
      locales: [],
    });
  });

  it('should register the content sitemap route', () => {
    const { nuxt } = createNuxtMock();

    setupSitemapModule({}, nuxt);

    expect(addServerHandlerMock).toHaveBeenCalledTimes(1);
    expect(addServerHandlerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        handler: './runtime/sitemap.xml',
        route: '/sitemap/content-sitemap.xml',
      }),
    );
  });
});
