export default defineNuxtPlugin({
  name: 'init-initial-data',
  async setup() {
    const { setInitialDataSSR } = useInitialSetup();
    const { fetchFooterBlock } = useCategoryTemplate();
    const route = useRoute();

    await callOnce(async () => {
      const promises: Promise<unknown>[] = [setInitialDataSSR()];

      const identifier = String(route.meta.identifier);
      const type = String(route.meta.type);

      if (route.meta.isBlockified && type && identifier !== undefined && identifier !== '0') {
        const { $i18n } = useNuxtApp();
        const { getBlocksServer } = useCategoryTemplate(identifier, type, $i18n.locale.value);

        promises.push(getBlocksServer(identifier, type));
      } else {
        promises.push(fetchFooterBlock());
      }

      await Promise.all(promises);
    });
  },
});
