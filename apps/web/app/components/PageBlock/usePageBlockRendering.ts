import type { PageBlockProps } from './types';

/**
 * Provides block component resolution, props, and lazy-loading behavior shared by page block renderers.
 */
export const usePageBlockRendering = (props: PageBlockProps) => {
  const attrs = useAttrs();
  let lazyLoadObserver: IntersectionObserver | null = null;
  const { lazyLoadStates, lazyLoadRefs, shouldLazyLoad, getLazyLoadKey, getLazyLoadConfig, getLazyLoadRef } =
    useBlockManager();
  const { blockUuid } = useSiteConfiguration();

  const blockComponent = computed(() => {
    if (!props.block.name) {
      return null;
    }
    return getCachedBlockComponent(props.block.name);
  });

  const blockIsCurrentlyOpen = computed(() => blockUuid.value === props.block.meta.uuid);

  const contentProps = computed(() => {
    const baseProps = props.root ? { ...props.block } : { ...props.block, ...attrs };
    const config = getLazyLoadConfig(props.block.name);

    if (config) {
      const uniqueKey = getLazyLoadKey(props.block.name, props.block.meta.uuid);
      const lazyLoadState = lazyLoadStates.value[uniqueKey] || blockIsCurrentlyOpen.value;

      return {
        ...baseProps,
        enableActions: props.enableActions,
        root: props.root,
        [config.propName]: lazyLoadState,
      };
    }

    return {
      ...baseProps,
      enableActions: props.enableActions,
      root: props.root,
    };
  });

  const observeLazyLoadSection = (blockName: string) => {
    const config = getLazyLoadConfig(blockName);
    const uniqueKey = getLazyLoadKey(blockName, props.block.meta.uuid);

    if (import.meta.client && lazyLoadRefs.value[uniqueKey] && config) {
      lazyLoadObserver = new globalThis.IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            lazyLoadStates.value[uniqueKey] = true;
            lazyLoadObserver?.disconnect();
            lazyLoadObserver = null;
          }
        },
        {
          threshold: config.threshold || 0,
          rootMargin: config.rootMargin || '0px 0px 250px 0px',
        },
      );
      lazyLoadObserver.observe(lazyLoadRefs.value[uniqueKey]!);
    }
  };

  onNuxtReady(() => {
    if (shouldLazyLoad(props.block.name)) {
      observeLazyLoadSection(props.block.name);
    }
  });

  onBeforeUnmount(() => {
    lazyLoadObserver?.disconnect();
  });

  return { blockComponent, contentProps, getLazyLoadRef };
};
