export default defineNuxtPlugin(async () => {
  const { setInitialDataSSR } = useInitialSetup();
  await callOnce(async () => {
    await setInitialDataSSR();
  });
});
