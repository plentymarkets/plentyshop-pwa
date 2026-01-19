export default defineNuxtPlugin({
  name: 'init-initial-data',
  async setup() {
    const { setInitialDataSSR } = useInitialSetup();
    await callOnce(async () => {
      await setInitialDataSSR();
    });
  },
});
