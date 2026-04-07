import type { Block } from '@plentymarkets/shop-api';
import type { BlocksPageResponse, UseBlocksReturn } from './types';
import { createDefaultHeaderContainerBlock, getHeaderContainerTemplate } from '~/utils/blockTemplates/header';
import { createFooter, createDefaultFooterContent, getFooterTemplate } from '~/utils/blockTemplates/footer';
import { createHomepage, getHomepageTemplate } from '~/utils/blockTemplates/homepage';
import { createCategory, getCategoryTemplate } from '~/utils/blockTemplates/category';
import { createProduct, getProductTemplate } from '~/utils/blockTemplates/product';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';

const FOOTER_BLOCK_NAME = 'Footer';

const isFooterBlock = (block: Block): boolean => block?.name === FOOTER_BLOCK_NAME;

const isHeaderEmpty = (block: Block | null | undefined): boolean => {
  if (!block) return true;
  return !Array.isArray(block.content) || block.content.length === 0;
};

const normalizeFooter = (block: Block): Block => {
  const defaults = createDefaultFooterContent() as Record<string, any>;
  const content = (block.content ?? {}) as Record<string, any>;

  block.content = {
    ...defaults,
    ...content,
    column1: { ...defaults.column1, ...content.column1 },
    column2: { ...defaults.column2, ...content.column2 },
    column3: { ...defaults.column3, ...content.column3 },
    column4: { ...defaults.column4, ...content.column4 },
    colors: { ...defaults.colors, ...content.colors },
  };

  return block;
};

const getDefaultPageBlocks = (type: string, locale: string): Block[] => {
  let blocks: Block[];

  switch (type) {
    case 'immutable':
      blocks = createHomepage();
      break;
    case 'category':
      blocks = createCategory();
      break;
    case 'product':
      blocks = createProduct();
      break;
    default:
      return [];
  }

  return blocks;
};

export const useBlocks: UseBlocksReturn = () => {
  const { $i18n } = useNuxtApp();

  const state = useState(`useBlocks-${$i18n.locale.value}`, () => ({
    data: {} as BlocksPageResponse,
    cleanData: {} as BlocksPageResponse,
    loading: false,
  }));

  const fetchBlocks = async (identifier: string | number, type: string) => {
    state.value.loading = true;

    const locale = $i18n.locale.value;

    const { data } = await useAsyncData(`blocks-${locale}-${type}-${identifier}`, () =>
      useSdk().plentysystems.getBlocks({ identifier, type, enableGlobalBlocks: true }),
    );

    const raw = data.value?.data;
    const response = (Array.isArray(raw) ? {} : raw ?? {}) as Partial<BlocksPageResponse>;

    const headerContainer = isHeaderEmpty(response.HeaderContainer)
      ? createDefaultHeaderContainerBlock()
      : response.HeaderContainer!;

    const footer = normalizeFooter(response.Footer ?? createFooter());

    const blocks =
      Array.isArray(response.blocks) && response.blocks.length > 0
        ? response.blocks
        : getDefaultPageBlocks(type, locale);

    state.value.data = { blocks, HeaderContainer: headerContainer, Footer: footer };

    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
    state.value.loading = false;
  };

  return {
    blocks: computed(() => (state.value.data?.blocks ?? []) as Block[]),
    cleanData: computed(() => (state.value.data?.cleanData ?? []) as Block[]),
    headerContainer: computed(() => (state.value.data?.HeaderContainer ?? null) as Block | null),
    footer: computed(() => (state.value.data?.Footer ?? null) as Block | null),
    loading: computed(() => state.value.loading),
    fetchBlocks,
  };
};
