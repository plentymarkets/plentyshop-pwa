import type { ApiError, Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import type { UseBlocksState, UseBlocksReturn } from './types';
import type { FooterSwitchDefinition } from '~/components/blocks/Footer/types';
import { createDefaultHeaderContainerBlock } from '~/utils/blockTemplates/header';
import { createFooter, createDefaultFooterContent } from '~/utils/blockTemplates/footer';
import { createHomepage } from '~/utils/blockTemplates/homepage';
import { createCategory } from '~/utils/blockTemplates/category';
import { createProduct } from '~/utils/blockTemplates/product';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';
import { migrateAllBlocks } from '~/utils/migrate-blocks';

const FOOTER_BLOCK_NAME = 'Footer';
const HEADER_BLOCK_NAME = 'Header';

export const isFooterBlock = (block: Block | null | undefined): boolean => block?.name === FOOTER_BLOCK_NAME;
export const isHeaderBlock = (block: Block | null | undefined): boolean => block?.name === HEADER_BLOCK_NAME;
export const isGlobalBlock = (block: Block | null | undefined): boolean =>
  isFooterBlock(block) || isHeaderContainerBlock(block);

export const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  { columnGroup: 'legal', key: 'showTermsAndConditions', shopTranslationKey: 'legal.termsAndConditions', editorTranslationKey: 'column-1-terms-and-conditions-label', link: paths.termsAndConditions },
  { columnGroup: 'legal', key: 'showCancellationRights', shopTranslationKey: 'legal.cancellationRights', editorTranslationKey: 'column-1-cancellation-rights-label', link: paths.cancellationRights },
  { columnGroup: 'legal', key: 'showCancellationForm', shopTranslationKey: 'legal.cancellationForm', editorTranslationKey: 'column-1-cancellation-form-label', link: paths.cancellationForm },
  { columnGroup: 'legal', key: 'showLegalDisclosure', shopTranslationKey: 'legal.legalDisclosure', editorTranslationKey: 'column-1-legal-disclosure-label', link: paths.legalDisclosure },
  { columnGroup: 'legal', key: 'showPrivacyPolicy', shopTranslationKey: 'legal.privacyPolicy', editorTranslationKey: 'column-1-privacy-policy-label', link: paths.privacyPolicy },
  { columnGroup: 'legal', key: 'showDeclarationOfAccessibility', shopTranslationKey: 'legal.declarationOfAccessibility', editorTranslationKey: 'column-1-declaration-of-accessibility-label', link: paths.declarationOfAccessibility },
  { columnGroup: 'services', key: 'showContactLink', shopTranslationKey: 'footer.contact.label', editorTranslationKey: 'column-2-contact-label', link: paths.contact },
  { columnGroup: 'services', key: 'showRegisterLink', shopTranslationKey: 'footer.register.label', editorTranslationKey: 'column-2-register-label', link: paths.register },
];

const isHeaderEmpty = (block: Block | null | undefined): boolean => {
  if (!block) return true;
  return !Array.isArray(block.content) || block.content.length === 0;
};

const normalizeFooter = (block: Block): Block => {
  const defaultBlock = createFooter();
  const defaults = defaultBlock.content as Record<string, Record<string, unknown>>;
  const content = (block.content ?? {}) as Record<string, Record<string, unknown>>;

  block.meta = { ...defaultBlock.meta, ...block.meta };
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

const getDefaultPageBlocks = (type: string): Block[] => {
  switch (type) {
    case 'immutable':
      return createHomepage();
    case 'category':
      return createCategory();
    case 'product':
      return createProduct();
    default:
      return [];
  }
};

const assembleBlocks = (raw: Block[] | GetBlocksResponse | null | undefined, type: string): Block[] => {
  let headerContainer: Block;
  let footer: Block;
  let pageBlocks: Block[];

  if (Array.isArray(raw)) {
    headerContainer = raw.find((b: Block) => isHeaderContainerBlock(b)) ?? createDefaultHeaderContainerBlock();
    footer = normalizeFooter(raw.find((b: Block) => isFooterBlock(b)) ?? createFooter());
    pageBlocks = raw.filter((b: Block) => !isHeaderContainerBlock(b) && !isFooterBlock(b) && !isHeaderBlock(b));
  } else if (raw && typeof raw === 'object') {
    headerContainer = isHeaderEmpty(raw.HeaderContainer)
      ? createDefaultHeaderContainerBlock()
      : raw.HeaderContainer!;
    footer = normalizeFooter(raw.Footer ?? createFooter());
    pageBlocks =
      Array.isArray(raw.blocks) && raw.blocks.length > 0
        ? raw.blocks
        : getDefaultPageBlocks(type);
  } else {
    headerContainer = createDefaultHeaderContainerBlock();
    footer = normalizeFooter(createFooter());
    pageBlocks = getDefaultPageBlocks(type);
  }

  if (pageBlocks.length === 0) {
    pageBlocks = getDefaultPageBlocks(type);
  }

  const allBlocks = [headerContainer, ...pageBlocks, footer];
  migrateAllBlocks(allBlocks);
  return allBlocks;
};

export const useBlocks: UseBlocksReturn = () => {
  const { $i18n } = useNuxtApp();

  const state = useState<UseBlocksState>(`useBlocks-${$i18n.locale.value}`, () => ({
    data: [],
    cleanData: [],
    defaultTemplateData: [],
    loading: false,
  }));

  const fetchBlocks = async (identifier: string | number, type: string) => {
    state.value.loading = true;

    const locale = $i18n.locale.value;

    const { data, error } = await useAsyncData(`blocks-${locale}-${type}-${identifier}`, () =>
      useSdk().plentysystems.getBlocks({ identifier, type, enableGlobalBlocks: true }),
    );

    if (error.value) {
      console.warn('Failed to fetch blocks:', error.value.message);
    }

    const allBlocks = assembleBlocks(data.value?.data, type);

    state.value.data = allBlocks;
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));
    state.value.loading = false;
  };

  const saveBlocks = async (identifier: string | number, type: string, content: string): Promise<boolean> => {
    try {
      state.value.loading = true;

      const response = await useSdk().plentysystems.doSaveBlocks({
        identifier,
        entityType: type,
        blocks: content,
      });

      const allBlocks = assembleBlocks(response?.data ?? state.value.data, type);
      state.value.data = allBlocks;
      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));

      return true;
    } catch (error) {
      useHandleError(error as ApiError);
      console.error('Error saving blocks:', error);
      return false;
    } finally {
      state.value.loading = false;
    }
  };

  const setupBlocks = (rawBlocks: Block[], type: string = 'immutable') => {
    const allBlocks = assembleBlocks(rawBlocks, type);
    state.value.data = allBlocks;
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));
  };

  const updateBlocks = (blocks: Block[]) => {
    state.value.data = blocks;
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  return {
    data: computed(() => state.value.data),
    cleanData: computed(() => state.value.cleanData),
    blocks: computed(() =>
      state.value.data.filter((b) => !isHeaderContainerBlock(b) && !isFooterBlock(b) && !isHeaderBlock(b)),
    ),
    renderableBlocks: computed(() => state.value.data.filter((b) => !isGlobalBlock(b))),
    headerContainer: computed(() => state.value.data.find((b) => isHeaderContainerBlock(b))),
    footer: computed(() => state.value.data.find((b) => isFooterBlock(b))),
    loading: computed(() => state.value.loading),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
    fetchBlocks,
    saveBlocks,
    setupBlocks,
    updateBlocks,
    setDefaultTemplate,
    FOOTER_SWITCH_DEFINITIONS,
  };
};
