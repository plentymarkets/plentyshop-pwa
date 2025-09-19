export default defineNuxtPlugin(async () => {
  const { setInitialDataSSR } = useInitialSetup();
  await callOnce(async () => {
    console.log('Setting initial data for SSR...');
    await setInitialDataSSR();
  });
});
