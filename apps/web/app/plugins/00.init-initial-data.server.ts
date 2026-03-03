export default defineNuxtPlugin({
  name: 'init-initial-data',
  async setup() {
    const { setInitialDataSSR, fetchSettings } = useInitialSetup();
    await callOnce(async () => {
      await Promise.all([setInitialDataSSR(), fetchSettings()]);
    });
  },
});
