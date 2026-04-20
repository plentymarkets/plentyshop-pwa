import type { ApiError, Block, GetBlocksResponse } from '@plentymarkets/shop-api';
import type { UseBlocksState, UseBlocksReturn } from './types';
import type { FooterSwitchDefinition } from '~/components/blocks/Footer/types';
import { createDefaultHeaderContainerBlock } from '~/utils/blockTemplates/header';
import { createFooter } from '~/utils/blockTemplates/footer';
import { createHomepage } from '~/utils/blockTemplates/homepage';
import { createCategory } from '~/utils/blockTemplates/category';
import { createProduct } from '~/utils/blockTemplates/product';
import { isHeaderContainerBlock } from '~/utils/blockTemplates/header/factory';
import { migrateAllBlocks } from '~/utils/migrate-blocks';

declare module '#app' {
  interface NuxtApp {
    _settleTimer?: ReturnType<typeof setTimeout> | null;
  }
}

const FOOTER_BLOCK_NAME = 'Footer';
const HEADER_BLOCK_NAME = 'Header';

export const isFooterBlock = (block: Block | null | undefined): boolean => block?.name === FOOTER_BLOCK_NAME;
export const isHeaderBlock = (block: Block | null | undefined): boolean => block?.name === HEADER_BLOCK_NAME;
export const isGlobalBlock = (block: Block | null | undefined): boolean =>
  isFooterBlock(block) || isHeaderContainerBlock(block);

export const FOOTER_SWITCH_DEFINITIONS: FooterSwitchDefinition[] = [
  {
    columnGroup: 'legal',
    key: 'showTermsAndConditions',
    shopTranslationKey: 'legal.termsAndConditions',
    editorTranslationKey: 'column-1-terms-and-conditions-label',
    link: paths.termsAndConditions,
  },
  {
    columnGroup: 'legal',
    key: 'showLegalDisclosure',
    shopTranslationKey: 'legal.legalDisclosure',
    editorTranslationKey: 'column-1-legal-disclosure-label',
    link: paths.legalDisclosure,
  },
  {
    columnGroup: 'legal',
    key: 'showPrivacyPolicy',
    shopTranslationKey: 'legal.privacyPolicy',
    editorTranslationKey: 'column-1-privacy-policy-label',
    link: paths.privacyPolicy,
  },
  {
    columnGroup: 'legal',
    key: 'showDeclarationOfAccessibility',
    shopTranslationKey: 'legal.declarationOfAccessibility',
    editorTranslationKey: 'column-1-declaration-of-accessibility-label',
    link: paths.declarationOfAccessibility,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationRights',
    shopTranslationKey: 'legal.cancellationRights',
    editorTranslationKey: 'column-1-cancellation-rights-label',
    link: paths.cancellationRights,
  },
  {
    columnGroup: 'legal',
    key: 'showCancellationForm',
    shopTranslationKey: 'legal.cancellationForm',
    editorTranslationKey: 'column-1-cancellation-form-label',
    link: paths.cancellationForm,
  },
  {
    columnGroup: 'services',
    key: 'showContactLink',
    shopTranslationKey: 'footer.contact.label',
    editorTranslationKey: 'column-2-contact-label',
    link: paths.contact,
  },
  {
    columnGroup: 'services',
    key: 'showRegisterLink',
    shopTranslationKey: 'footer.register.label',
    editorTranslationKey: 'column-2-register-label',
    link: paths.register,
  },
];

const isBlockEmpty = (block: Block | null | undefined): boolean => {
  if (!block) return true;
  return !Array.isArray(block.content) || block.content.length === 0;
};

const normalizeFooter = (block: Block): Block => {
  const defaultBlock = createFooter();
  const defaults = defaultBlock.content as Record<string, Record<string, unknown>>;
  const content = (block.content ?? {}) as Record<string, Record<string, unknown>>;

  return {
    ...block,
    meta: { ...defaultBlock.meta, ...block.meta },
    content: {
      ...defaults,
      ...content,
      column1: { ...defaults.column1, ...content.column1 },
      column2: { ...defaults.column2, ...content.column2 },
      column3: { ...defaults.column3, ...content.column3 },
      column4: { ...defaults.column4, ...content.column4 },
      colors: { ...defaults.colors, ...content.colors },
    },
  };
};

const getDefaultPageBlocks = (type: string, identifier: string | number): Block[] => {
  switch (type) {
    case 'immutable':
      return createHomepage();
    case 'category':
      if (typeof identifier === 'number' && identifier > 0) {
        return [];
      }
      return createCategory();
    case 'product':
      return createProduct();
    default:
      return [];
  }
};

const assembleBlocks = (raw: GetBlocksResponse, type: string, identifier: string | number): GetBlocksResponse => {
  const HeaderContainer = isBlockEmpty(raw?.HeaderContainer)
    ? createDefaultHeaderContainerBlock()
    : raw?.HeaderContainer;

  const Footer = raw?.Footer ? normalizeFooter(raw.Footer) : normalizeFooter(createFooter());

  const pageBlocks =
    Array.isArray(raw?.blocks) && raw?.blocks.length > 0 ? raw?.blocks : getDefaultPageBlocks(type, identifier);

  migrateAllBlocks(pageBlocks);

  return { HeaderContainer, blocks: pageBlocks, Footer } as GetBlocksResponse;
};

export const useBlocks: UseBlocksReturn = () => {
  const state = useState<UseBlocksState>(`useBlocks`, () => ({
    data: {} as GetBlocksResponse,
    cleanData: {} as GetBlocksResponse,
    defaultTemplateData: [] as Block[],
    loading: false,
    isSettling: false,
  }));

  /*
   @description Schedule setting up clean data & editor enable reset with a timeout.
   */

  const scheduleCleanDataSync = () => {
    state.value.isSettling = true;
    const nuxtApp = useNuxtApp();
    if (nuxtApp._settleTimer) clearTimeout(nuxtApp._settleTimer);
    nuxtApp._settleTimer = setTimeout(() => {
      state.value.cleanData = markRaw(JSON.parse(JSON.stringify(state.value.data)));
      const { isEditingEnabled } = useEditor();
      isEditingEnabled.value = false;
      state.value.isSettling = false;
      nuxtApp._settleTimer = null;
    }, 150);
  };

  const headerContainer = computed(() => state.value.data.HeaderContainer);
  const footer = computed(() => state.value.data.Footer);
  const pageBlocks = computed(() => state.value.data.blocks ?? []);
  const allBlocks = computed(() => [
    ...(headerContainer.value ? [headerContainer.value] : []),
    ...pageBlocks.value,
    ...(footer.value ? [footer.value] : []),
  ]);

  const fetchBlocks = async (identifier: string | number, type: string) => {
    state.value.loading = true;

    const { $i18n } = useNuxtApp();

    const loc = computed(() => $i18n.locale.value);

    const key = `blocks-${loc.value}-${type}-${identifier}`;

    const { data, error } = await useAsyncData(key, () =>
      useSdk().plentysystems.getBlocksWithGlobalBlocks({ identifier, type, enableGlobalBlocks: true }),
    );

    if (error.value) {
      console.warn('Failed to fetch blocks:', error.value.message);
    }

    const allBlocks = assembleBlocks(data.value?.data || ({} as GetBlocksResponse), type, identifier);

    const serialized = JSON.stringify(allBlocks);

    state.value.data = JSON.parse(serialized);
    state.value.cleanData = markRaw(JSON.parse(serialized));
    state.value.loading = false;

    const { isEditingEnabled } = useEditor();
    isEditingEnabled.value = false;

    if (import.meta.client) {
      scheduleCleanDataSync();
    }
  };

  const saveBlocks = async (identifier: string | number, type: string, content: string): Promise<boolean> => {
    try {
      state.value.loading = true;

      const response = await useSdk().plentysystems.doSaveBlocksWithGlobalBlocks({
        identifier,
        entityType: type,
        blocks: content,
        enableGlobalBlocks: true,
      });

      const allBlocks = assembleBlocks(
        (response?.data as unknown as GetBlocksResponse) ?? state.value.data,
        type,
        identifier,
      );
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

  const setupFakeBlocks = (rawBlocks: Block[], type: string = 'immutable', identifier: string | number = 0) => {
    const allBlocks = assembleBlocks(
      {
        HeaderContainer: headerContainer.value,
        blocks: rawBlocks,
        Footer: footer.value,
      } as GetBlocksResponse,
      type,
      identifier,
    );

    state.value.data = allBlocks;
    state.value.cleanData = markRaw(JSON.parse(JSON.stringify(allBlocks)));
  };

  const updateBlocks = (blocks: Block[]) => {
    state.value.data.blocks = blocks;
  };

  const discardChanges = () => {
    state.value.data = JSON.parse(JSON.stringify(state.value.cleanData));
  };

  const setDefaultTemplate = (blocks: Block[]) => {
    state.value.defaultTemplateData = blocks;
  };

  return {
    data: computed(() => state.value.data),
    cleanData: computed(() => state.value.cleanData),
    pageBlocks,
    blocks: pageBlocks,
    allBlocks,
    headerContainer,
    footer,
    loading: computed(() => state.value.loading),
    defaultTemplateData: computed(() => state.value.defaultTemplateData),
    fetchBlocks,
    saveBlocks,
    setupFakeBlocks,
    updateBlocks,
    discardChanges,
    setDefaultTemplate,
    isSettling: computed(() => state.value.isSettling),
    FOOTER_SWITCH_DEFINITIONS,
  };
};
