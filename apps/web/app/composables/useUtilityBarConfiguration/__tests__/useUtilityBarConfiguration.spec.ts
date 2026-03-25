import { describe, expect, it, beforeEach, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import type { UtilityBarContent, UtilityBarProps } from '~/components/blocks/UtilityBar/types';

import { useUtilityBarConfiguration } from '../useUtilityBarConfiguration';

const routeRef = ref({
  meta: {
    identifier: 'home',
    type: 'content',
  },
});

const localeRef = ref('en');
const blockUuidRef = ref<string | undefined>(undefined);
const templatesRef = ref<Block[]>([]);
const headerContainerCacheRef = ref<{ content: Block[] } | null>(null);

const findOrDeleteBlockByUuid = vi.fn();
const setContent = vi.fn();
const stateContent = ref<UtilityBarContent>();

const sections = computed(() => []);
const paddingStyles = computed(() => ({}));
const isFullSearchMode = computed(() => true);

const createContent = (): UtilityBarContent => ({
  layout: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
  sectionOrder: { sections: ['logo', 'search', 'actions'] },
  sectionVisibility: { logo: true, search: true, actions: true },
  color: { iconColor: '#fff', backgroundColor: 'rgb(var(--colors-2-primary-500))' },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: ['language', 'wishlist', 'cart', 'account'],
    visibility: { language: true, wishlist: true, cart: true, account: true },
  },
});

const createUtilityBarBlock = (uuid: string, content = createContent()): UtilityBarProps => ({
  name: 'UtilityBar',
  type: 'content',
  content,
  meta: { uuid },
});

mockNuxtImport('useSiteConfiguration', () => () => ({
  blockUuid: blockUuidRef,
}));

mockNuxtImport('useRoute', () => () => routeRef.value);

mockNuxtImport('useNuxtApp', () => () => ({
  $i18n: {
    locale: localeRef,
  },
}));

mockNuxtImport('useBlockTemplates', () => () => ({
  data: templatesRef,
  headerContainerCache: headerContainerCacheRef,
}));

mockNuxtImport('useBlockManager', () => () => ({
  findOrDeleteBlockByUuid,
}));

mockNuxtImport('useUtilityBarState', () => () => ({
  content: stateContent,
  sections,
  setContent,
  paddingStyles,
  isSectionVisible: vi.fn(() => true),
  getSectionFlexOrder: vi.fn(() => 0),
  isActionVisible: vi.fn(() => true),
  getActionOrder: vi.fn(() => 0),
  isFullSearchMode,
}));

describe('useUtilityBarConfiguration', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    routeRef.value = {
      meta: {
        identifier: 'home',
        type: 'content',
      },
    };
    localeRef.value = 'en';
    blockUuidRef.value = undefined;
    templatesRef.value = [];

    stateContent.value = createContent();
    setContent.mockImplementation((incoming) => {
      if (incoming) {
        stateContent.value = JSON.parse(JSON.stringify(incoming));
      }
    });

    findOrDeleteBlockByUuid.mockReturnValue(null);
    headerContainerCacheRef.value = null;
  });

  it('should use block resolved by uuid and sync block content into state', () => {
    const block = createUtilityBarBlock('target-uuid', {
      ...createContent(),
      search: { displayMode: 'icon-only' },
    });

    blockUuidRef.value = 'target-uuid';
    templatesRef.value = [block];
    findOrDeleteBlockByUuid.mockReturnValue(block);

    const { utilityBarBlock, content } = useUtilityBarConfiguration();

    expect(findOrDeleteBlockByUuid).toHaveBeenCalled();
    expect(utilityBarBlock.value).toBe(block);
    expect(setContent).toHaveBeenCalledWith(block.content);
    expect(content.value.search.displayMode).toBe('icon-only');
  });

  it('should fallback to single UtilityBar match when uuid lookup returns null', () => {
    const utilityBar = createUtilityBarBlock('fallback-uuid');
    const nonUtilityBar: Block = {
      name: 'HeroBanner',
      type: 'content',
      content: {},
      meta: { uuid: 'hero-uuid' },
    };

    templatesRef.value = [nonUtilityBar, utilityBar];

    const { utilityBarBlock } = useUtilityBarConfiguration();

    expect(utilityBarBlock.value).toEqual(utilityBar);
  });

  it('should return null when multiple UtilityBar blocks exist and uuid is not provided', () => {
    templatesRef.value = [createUtilityBarBlock('uuid-1'), createUtilityBarBlock('uuid-2')];

    const { utilityBarBlock } = useUtilityBarConfiguration();

    expect(utilityBarBlock.value).toBeNull();
  });

  it('should resolve block from headerContainerCache when uuid is not found in data', () => {
    const block = createUtilityBarBlock('header-uuid', {
      ...createContent(),
      search: { displayMode: 'icon-only' },
    });

    blockUuidRef.value = 'header-uuid';
    templatesRef.value = [];
    headerContainerCacheRef.value = { content: [block] };

    findOrDeleteBlockByUuid.mockReturnValueOnce(null).mockReturnValueOnce(block);

    const { utilityBarBlock, content } = useUtilityBarConfiguration();

    expect(utilityBarBlock.value).toBe(block);
    expect(setContent).toHaveBeenCalledWith(block.content);
    expect(content.value.search.displayMode).toBe('icon-only');
  });

  it('should expose utility bar state helpers from useUtilityBarState', () => {
    const block = createUtilityBarBlock('sync-uuid');
    blockUuidRef.value = 'sync-uuid';
    templatesRef.value = [block];
    findOrDeleteBlockByUuid.mockReturnValue(block);

    const config = useUtilityBarConfiguration();

    expect(config.sections.value).toEqual([]);
    expect(config.paddingStyles.value).toEqual({});
    expect(config.isSectionVisible('logo')).toBe(true);
    expect(config.getSectionFlexOrder('logo')).toBe(0);
    expect(config.isActionVisible('cart')).toBe(true);
    expect(config.getActionOrder('cart')).toBe(0);
    expect(config.isFullSearchMode.value).toBe(true);
  });
});
