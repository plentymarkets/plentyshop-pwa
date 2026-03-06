import type { Block } from '@plentymarkets/shop-api';
import type { FlatBlock } from '~/components/TableOfContents/types';

export const useTableOfContents = () => {
  const { setIndex } = useCarousel();
  const route = useRoute();
  const { $i18n } = useNuxtApp();
  const { isStructureBlock } = useBlockManager();
  const selectedUuid = ref('');
  const expandedBlocks = ref(new Set<string>());

  const data = computed(() => {
    const identifier = route?.meta?.identifier as string;
    const type = route.meta.type as string;
    const locale = $i18n.locale.value;

    if (identifier === undefined || !type) return [];

    const { data: blockData } = useBlockTemplates(identifier, type, locale);

    return blockData.value ?? [];
  });

  watch(
    () => route.fullPath,
    () => {
      expandedBlocks.value.clear();
      selectedUuid.value = '';
    },
  );

  const formatBlockName = (name: string): string => {
    if (!name) return 'Unknown Block';
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  const flattenBlocks = (blocks: Block[], depth = 0): FlatBlock[] => {
    const result: FlatBlock[] = [];
    for (const block of blocks) {
      if (!block.meta?.uuid) continue;
      result.push({
        uuid: block.meta.uuid,
        label: formatBlockName(block.name),
        depth,
        block,
      });
    }
    return result;
  };

  const flatBlocks = computed(() => (data.value.length ? flattenBlocks(data.value) : []));

  const toggleBlockExpansion = (uuid: string) => {
    if (expandedBlocks.value.has(uuid)) {
      expandedBlocks.value.delete(uuid);
    } else {
      expandedBlocks.value.add(uuid);
    }
  };

  const getChildren = (item: FlatBlock): FlatBlock[] => {
    const children: FlatBlock[] = [];
    if (Array.isArray(item.block.content)) {
      for (const child of item.block.content as Block[]) {
        if (child.meta?.uuid) {
          children.push({
            uuid: child.meta.uuid,
            label: formatBlockName(child.name),
            depth: item.depth + 1,
            block: child,
          });
        }
      }
    }
    return children;
  };

  const scrollToBlock = (uuid: string) => {
    selectedUuid.value = uuid;
    const el = document.querySelector(`[data-uuid="${uuid}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      el.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
      }, 1500);
    }
  };

  const editBlock = (block: Block) => {
    const { openDrawerWithView } = useSiteConfiguration();

    scrollToBlock(block.meta.uuid);

    if (data.value) {
      for (const parentBlock of data.value) {
        if (parentBlock.name === 'Carousel' && Array.isArray(parentBlock.content)) {
          const slideIndex = (parentBlock.content as Block[]).findIndex(
            (slide) => slide.meta?.uuid === block.meta.uuid,
          );
          if (slideIndex !== -1) {
            setIndex(parentBlock.meta.uuid, slideIndex);
            break;
          }
        }
      }
    }

    openDrawerWithView('blocksSettings', block);
  };

  return {
    selectedUuid,
    expandedBlocks,
    flatBlocks,
    isStructureBlock,
    toggleBlockExpansion,
    getChildren,
    scrollToBlock,
    editBlock,
  };
};
