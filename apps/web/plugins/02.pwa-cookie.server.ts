export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const showConfigurationDrawer = config.showConfigurationDrawer;

  const pwaCookie = useCookie('pwa');
  const isPreview = useState('isPreview', () => false);

  isPreview.value = !!pwaCookie.value || showConfigurationDrawer;
});
